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
        'app/framework/Message',
        'app/framework/ModalDialog',
        'app/services/OrderEstimateService',
        'app/widgets/trade-preview/TradePreviewViewModel',
        'app/widgets/trade-preview/TradePreviewDialog',
        'keel/MessageBus',
        'jquery',
        'moment',
        'text!app/widgets/trade/TradeTemplate.html',
        'jqueryselectbox'
    ],
    function(
        MarketPrice,
        Repository,
        ErrorUtil,
        Formatter,
        Message,
        ModalDialog,
        OrderEstimateService,
        TradePreviewViewModel,
        TradePreviewDialog,
        MessageBus,
        $,
        moment,
        TradeTemplate
    ) {
        'use strict';

        return ModalDialog.extend({
            id: 'trade-dialog',
            className: 'modal theme-a',

            template: {
                name: 'TradeTemplate',
                source: TradeTemplate
            },

            elements: ['tradesymbol'],

            events: {
                'blur .field input[type="text"]': 'updateOrder',
                'change #trade-orderType': 'toggleLimitField',
                'change .field select': 'selectDropdown',
                'click #trade-preview-order': 'previewOrder',
                'click .bf-checkbox': 'selectCheckbox',
                'click .bf-radio': 'selectRadio',
                'click .close-button': 'close',
                'mousedown': 'blurForm'
            },

            initialize: function() {

                this.orderRequest = {
                    brokerageAccountId: null,
                    orderParams: {
                        symbol: null,
                        side: 'Buy', // Default to Buy
                        quantity: 0,
                        type: 'Market',
                        term: 'GoodForTheDay',
                        allOrNone: false
                    }
                };

                this.settings = {
                    draggable: true
                };

                return this;
            },

            blurForm: function(e) {
                if ( e.target.tagName.toUpperCase() !== 'INPUT') {
                    e.preventDefault();
                    $(document.activeElement).blur();
                }
            },

            checkTypedSymbol: function(e) {
                var that = this,
                    input = $(e.target).val().toUpperCase(),
                    match = false;

                if (input.length > 0) {
                    $(this.instruments).each(function(){
                        if ( this.value === input ) {
                            match = true;

                        }
                    });
                }

                if (match) {
                    that.orderRequest.orderParams.symbol = input;
                    $(e.target).val(input);
                    that.symbolChanged(input);
                    that.createEstimate();
                } else {
                    that.symbolNotRecognized();
                }

            },

            createEstimate: function(callback) {

                var tradeDialog = this;

                this.orderRequest.brokerageAccountId = this.$el.find('#trade-accountId').val();
                if (this.orderRequest.orderParams.type === 'Market') {
                    delete this.orderRequest.orderParams.limitPrice;
                }

                delete this.orderRequest.orderEstimate;

                if (this.validateOrder()) {

                    OrderEstimateService.createOrderEstimate(this.orderRequest, function(response) {
                        var estimatedValue = Formatter.formatMoney(response.estimatedValue);
                        var fees = Formatter.formatMoney(response.fees);
                        var estimatedValueInclFees = Formatter.formatMoney(response.estimatedValueInclFees);

                        tradeDialog.orderRequest.orderEstimate = {
                            estimatedValue: estimatedValue,
                            fees: fees,
                            estimatedValueInclFees: estimatedValueInclFees
                        };

                        $('#tradeCost').html(estimatedValue);
                        $('#fees-field, #fees').html(fees);
                        $('#totalCost').html(estimatedValueInclFees);

                    }, ErrorUtil.showError);
                }

                if ( callback instanceof Function ) {
                    callback();
                }
            },

            postPlace: function(){
                ModalDialog.prototype.postPlace.call(this);

                $('#trade-accountId, #trade-orderType, #trade-term').selectbox();
                this._initSymbolField();

                return this;
            },

            previewOrder: function(){
                if (this.validateOrder()) {
                    var previewOrderDialog = this.addChild({
                        id: 'TradePreviewDialog',
                        viewClass: TradePreviewDialog,
                        parentElement: $('body'),
                        options: {
                            model: new TradePreviewViewModel(this.orderRequest)
                        }
                    });

                    // Stack above this dialog box
                    previewOrderDialog.stack();
                }
            },

            selectCheckbox: function(e) {
                e.preventDefault();

                var tradeDialog = this;

                var target = $(e.currentTarget);
                var $checkbox = $(':checkbox[value=' + target.attr('attr-value') + ']');

                if ( $checkbox.is(':checked') ) {
                    target.addClass('empty');
                    target.removeClass('selected icon-ok');
                    $checkbox.attr('checked', false);
                    tradeDialog.orderRequest.orderParams.allOrNone = false;
                } else {
                    target.removeClass('empty');
                    target.addClass('selected icon-ok');
                    $checkbox.attr('checked', true);
                    tradeDialog.orderRequest.orderParams.allOrNone = true;
                }

                this.createEstimate();

                return this;
            },

            selectDropdown: function(e) {
                var tradeDialog = this,
                    target = $(e.target),
                    name = $(target).attr('name');

                if ( name !== 'brokerageAccountId') {
                    tradeDialog.orderRequest.orderParams[name] = $(target).val();
                }

                this.createEstimate();

                return this;
            },

            selectRadio: function(e){

                // Cache DOM element
                var target = $(e.target);

                // Update pseudo-buttons
                target.siblings('a.selected').removeClass('selected');
                target.addClass('selected');

                // Update radio buttons
                $(':radio[value=' + target.attr('attr-value') + ']').siblings().attr('checked', false);
                $(':radio[value=' + target.attr('attr-value') + ']').attr('checked', true);

                this.orderRequest.orderParams.side = target.text();
                this.createEstimate();

                return this;
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

            toggleLimitField: function(e){
                if ( $(e.target).val().toLowerCase() === 'limit' ) {
                    $('.limit-price').removeClass('hidden');
                } else {
                    $('.limit-price').addClass('hidden');
                }

                this.createEstimate();

                return this;
            },

            updateOrder: function(e) {

                var tradeDialog = this,
                    target = e.target,
                    name = $(target).attr('name');

                switch (name) {
                case 'brokerageAccountId':
                case 'tradeSymbol':
                    break;
                case 'limitPrice':
                    tradeDialog.orderRequest.orderParams[name] = {
                        amount: $(target).val(),
                        currency: tradeDialog.marketPrice.attributes.price.currency
                    };
                    break;
                default:
                    tradeDialog.orderRequest.orderParams[name] = $(target).val();
                }

                // tradeSymbol field is a special case
                if ( name !== 'tradeSymbol') {
                    this.createEstimate();
                }

                return this;
            },

            validateOrder: function() {
                var orderParams = this.orderRequest.orderParams;
                var isValid = orderParams.symbol &&
                    orderParams.quantity &&
                    (orderParams.type === 'Market' || (orderParams.type === 'Limit' && orderParams.hasOwnProperty('limitPrice') ));

                return isValid;
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

            _initSymbolField: function() {
                var tradeDialog = this;

                var instruments = $.map(Repository.getInstruments(), function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });

                this.instruments = instruments;

                $(this.tradesymbolElement).autocomplete({
                    source: function( request, response ) {
                        var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), 'i' );

                        response( $.grep( instruments, function( item ) {
                            return matcher.test(item.label);
                        }) );
                    },
                    change: function( event ) {
                        tradeDialog.checkTypedSymbol(event);
                    },
                    select: function( event, ui ) {
                        tradeDialog.symbolChanged(ui.item.value);
                    }
                });

                return this.instruments;
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