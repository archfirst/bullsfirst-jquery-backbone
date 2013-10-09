/**
 * Copyright 2013 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * app/widgets/trade/TradeDialog
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/MarketPrice',
        'app/domain/Repository',
        'app/framework/ErrorUtil',
        'app/framework/Formatter',
        'app/framework/ModalDialog',
        'app/services/OrderEstimateService',
        'app/widgets/trade-preview/TradePreviewDialog',
        'backbone',
        'jquery',
        'text!app/widgets/trade/TradeTemplate.html',
        'select2',
        'stickit',
        'validation'
    ],
    function(MarketPrice, Repository, ErrorUtil, Formatter, ModalDialog,
        OrderEstimateService, TradePreviewDialog, Backbone, $, TradeTemplate) {
        'use strict';

        return ModalDialog.extend({
            id: 'trade-dialog',
            className: 'modal theme-a',

            template: {
                name: 'TradeTemplate',
                source: TradeTemplate
            },

            elements: ['symbol'],

            events: {
                'click #trade-preview-order': 'previewOrder',
                'click .close-button': 'close'
            },

            bindings: {
                '.js-account': {
                    observe: 'brokerageAccountId',
                    selectOptions: {
                        collection: Repository.getBrokerageAccounts(),
                        labelPath: 'name',
                        valuePath: 'id'
                    },
                    setOptions: { validate: true }
                },

                '.js-symbol': {
                    observe: 'symbol',
                    setOptions: { validate: true }
                },

                '.js-side': {
                    observe: 'side',
                    setOptions: { validate: true }
                },

                '.js-quantity': {
                    observe: 'quantity',
                    setOptions: { validate: true }
                },

                '.js-type': {
                    observe: 'type',
                    setOptions: { validate: true }
                },

                '.js-term': {
                    observe: 'term',
                    setOptions: { validate: true }
                },

                '.js-limitPriceElement': {
                    attributes: [{
                        name: 'class',
                        observe: 'type',
                        onGet: 'toggleLimitPriceField'
                    }]
                },

                '.js-limitPrice': {
                    observe: 'limitPrice',
                    setOptions: { validate: true }
                },

                '.js-allOrNone': {
                    observe: 'allOrNone',
                    setOptions: { validate: true }
                }
            },

            /* Caller to pass in an OrderRequest as the model */
            initialize: function() {

                Backbone.Validation.bind(this);

                this.settings = {
                    draggable: true
                };
            },

            postRender: function() {

                var instruments = Repository.getInstrumentCollection().getLabelValuePairs();

                $(this.symbolElement).autocomplete({

                    // This function is called every time the user types a character in the text field.
                    //     request.term contains the text currently in the text field
                    //     response is a callback whch expects a single argument, the data to suggest to the user.
                    //     It returns an array of objects with label and value properties:
                    //     [ { label: "Choice1", value: "value1" }, ... ]
                    source: function( request, response ) {
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');

                        response($.grep(instruments, function(item) {
                            return matcher.test(item.label);
                        }));
                    }
                });

                this.stickit();
            },

            createEstimate: function(callback) {

                var self = this;

                if (self.validateOrder()) {

                    var orderRequest = self.orderRequest;
                    orderRequest.brokerageAccountId = this.accountIdElement.val();
                    if (orderRequest.orderParams.type === 'Market') {
                        delete orderRequest.orderParams.limitPrice;
                    }

                    delete orderRequest.orderEstimate;

                    // Clean up any unwanted attributes
                    var cleanOrderRequest = {
                        brokerageAccountId: orderRequest.brokerageAccountId,
                        orderParams: orderRequest.orderParams
                    };

                    OrderEstimateService.createOrderEstimate(cleanOrderRequest, function(response) {
                        var estimatedValue = Formatter.formatMoney(response.estimatedValue);
                        var fees = Formatter.formatMoney(response.fees);
                        var estimatedValueInclFees = Formatter.formatMoney(response.estimatedValueInclFees);

                        orderRequest.orderEstimate = {
                            estimatedValue: estimatedValue,
                            fees: fees,
                            estimatedValueInclFees: estimatedValueInclFees
                        };

                        $('#tradeCost').html(estimatedValue);
                        $('#fees-field, #fees').html(fees);
                        $('#totalCost').html(estimatedValueInclFees);

                    }, ErrorUtil.showError);
                }

                if (callback instanceof Function) {
                    callback();
                }
            },

            previewOrder: function() {
                if (this.model.isValid(true)) {
                    var previewOrderDialog = this.addChild({
                        id: 'TradePreviewDialog',
                        viewClass: TradePreviewDialog,
                        parentElement: $('body'),
                        options: {
                            model: this.model
                        }
                    });

                    // Stack above this dialog box
                    previewOrderDialog.stack();
                }
            },

            symbolChanged: function(value) {
                this.orderRequest.orderParams.symbol = value;
                this._fetchMarketPrice(value);
            },

            symbolNotRecognized: function() {
                var zero = '$0.00';
                this.symbolChanged(null);
                this.createEstimate(function() {
                    $('#trade-form .last-trade-price-value').html('');
                    $('#last-trade-price').val(0);
                    $('#tradeCost').html(zero);
                    $('#fees-field, #fees').html(zero);
                    $('#totalCost').html(zero);
                });
            },

            toggleLimitPriceField: function(type) {
                return type === 'Market' ? 'hidden' : '';
            },

            _fetchMarketPrice: function(symbol) {
                var tradeDialog = this;
                if (symbol && symbol !== '') {
                    this.marketPrice = new MarketPrice({symbol: symbol});
                    this.marketPrice.fetch({
                        success: function(price) {
                            tradeDialog._marketPriceFetched(price);
                            tradeDialog.orderRequest.orderParams.symbol = symbol;
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            tradeDialog._marketPriceFetched(null);
                            ErrorUtil.showBackboneError(jqXHR, textStatus, errorThrown);
                        }
                    });
                }
                else {
                    this._marketPriceFetched(null);
                }
            },

            _marketPriceFetched: function(marketPrice) {
                var price = marketPrice ? Formatter.formatMoney(marketPrice.attributes.price) : '';
                $('#trade-form .last-trade-price-value').html(price);
                $('#last-trade-price').val(price);

                this.createEstimate();
            }

        });
    }
);