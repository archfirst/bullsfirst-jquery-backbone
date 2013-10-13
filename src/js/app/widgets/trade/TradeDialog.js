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

            elements: ['symbol', 'lastTradePrice', 'estimatedValue', 'fees', 'estimatedValueInclFees'],

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

                this.listenTo(this.model, 'change:symbol', this.symbolChanged);
            },

            postRender: function() {

                var self = this;
                var instruments = Repository.getInstrumentCollection().getLabelValuePairs();

                $(this.symbolElement).autocomplete({

                    // This function is called every time the user types a character in the text field.
                    //     request.term contains the text currently in the text field
                    //     response is a callback whch expects a single argument, the data to suggest to the user.
                    //     It returns an array of objects with label and value properties:
                    //     [ { label: "Choice1", value: "value1" }, ... ]
                    source: function(request, response) {
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');

                        response($.grep(instruments, function(item) {
                            return matcher.test(item.label);
                        }));
                    },

                    // jQuery UI autocomplete does not trigger a change event when an item is selected.
                    // So force the update of the model manually.
                    select: function(event, ui) {
                        self.model.set('symbol', ui.item.value);
                    }
                });

                this.stickit();
            },

            symbolChanged: function(model) {

                var value = model.get('symbol').toUpperCase();

                // Verify that it is a valid symbol and then fire a request to fetch the market price
                var instrument = Repository.getInstrumentCollection().findWhere({symbol: value});
                if (instrument) {
                    this._fetchMarketPrice(value);
                }
                else {
                    this.lastTradePriceElement.empty();
                    this.renderEstimate({
                        estimatedValue: 0,
                        fees: 0,
                        estimatedValueInclFees: 0
                    });
                }
            },

            createEstimate: function() {

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
                        this.renderEstimate(response);
                    }, ErrorUtil.showError);
                }
            },

            // estimate is {estimatedValue, fees, estimatedValueInclFees}
            renderEstimate: function(estimate) {
                this.estimatedValueElement.html( Formatter.formatMoney(estimate.estimatedValue) );
                this.feesElement.html( Formatter.formatMoney(estimate.fees) );
                this.estimatedValueInclFeesElement.html( Formatter.formatMoney(estimate.estimatedValueInclFees) );
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

            toggleLimitPriceField: function(type) {
                return type === 'Market' ? 'hidden' : '';
            },

            _fetchMarketPrice: function(symbol) {
                var tradeDialog = this;
                this.marketPrice = new MarketPrice({symbol: symbol});
                this.marketPrice.fetch({
                    success: function(marketPrice) {
                        var price = Formatter.formatMoney(marketPrice.get('price'));
                        tradeDialog.lastTradePriceElement.html(price);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        tradeDialog.lastTradePriceElement.empty();
                        ErrorUtil.showBackboneError(jqXHR, textStatus, errorThrown);
                    }
                });
            }
        });
    }
);