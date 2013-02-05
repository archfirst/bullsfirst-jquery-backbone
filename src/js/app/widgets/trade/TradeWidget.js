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
 * app/widgets/trade/TradeWidget
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/MarketPrice',
        'app/domain/Repository',
        'app/services/InstrumentService',
        'app/services/OrderEstimateService',
        'app/widgets/modal/ModalWidget',
        'app/widgets/trade-preview/TradePreviewViewModel',
        'app/widgets/trade-preview/TradePreviewWidget',
        'framework/ErrorUtil',
        'framework/Formatter',
        'framework/MessageBus',
        'jquery',
        'moment',
        'text!app/widgets/trade/TradeTemplate.html',
        'underscore',
        'jqueryselectbox'
    ],
    function(
        Message,
        MarketPrice,
        Repository,
        InstrumentService,
        OrderEstimateService,
        ModalWidget,
        TradePreviewViewModel,
        TradePreviewWidget,
        ErrorUtil,
        Formatter,
        MessageBus,
        $,
        moment,
        TradeTemplate,
        _
    ) {
        'use strict';

        return ModalWidget.extend({
            id: 'trade-modal',
            className: 'modal-wrapper right form-modal',

            template: {
                name: 'TradeTemplate',
                source: TradeTemplate
            },

            events: (function() {
                // Clone the prototype's events object, then extend it
                // TODO: figure out a better way to do this without instantiating a new object
                return _.extend(_.clone(new ModalWidget().events), {
                    'blur .modal-field input[type="text"]' : 'loseFocus',
                    'change .modal-field select' : 'selectDropdown',
                    'change #trade-orderType' : 'toggleLimitField',
                    'change #trade-quantity': 'updateQuantity',
                    'click' : 'blurForm',
                    'click .modal-checkbox' : 'selectCheckbox',
                    'click .modal-radio' : 'selectRadio',
                    'click #trade-preview-order' : 'previewOrder'
                });
            }()),

            blurForm: function(e) {
                if ( e.target.tagName.toUpperCase() !== 'INPUT') {
                    $(document.activeElement).blur();
                }
            },

            createEstimate: function() {

                var tradeWidget = this;

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

                        tradeWidget.orderRequest.orderEstimate = {
                            estimatedValue: estimatedValue,
                            fees: fees,
                            estimatedValueInclFees: estimatedValueInclFees
                        };

                        $('#tradeCost').html(estimatedValue);
                        $('#fees-field, #fees').html(fees);
                        $('#totalCost').html(estimatedValueInclFees);

                    }, ErrorUtil.showError);
                }
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
                    id: this.id,
                    title: 'Trade',
                    type: 'trade',
                    overlay: false,
                    draggable: true,
                    closeButton: true,
                    position: 'center'
                };

                return this;
            },

            loseFocus: function(e) {
                var tradeWidget = this,
                    target = e.target,
                    name = $(target).attr('name');

                switch ( name ) {
                    case 'brokerageAccountId':
                    case 'tradeSymbol':
                        break;
                    case 'limitPrice':
                        tradeWidget.orderRequest.orderParams[name] = {
                            amount: $(target).val(),
                            currency: tradeWidget.marketPrice.attributes.price.currency
                        };
                        break;
                    default:
                        tradeWidget.orderRequest.orderParams[name] = $(target).val();
                }

                this.createEstimate();
                return this;
            },

            postPlace: function(){
                MessageBus.trigger(Message.ModalLoad);

                // init the symbol autocomplete field
                // We want _initSymbolField to recognize the tradeWidget as this, so we pass a context
                InstrumentService.getInstruments(this._initSymbolField, ErrorUtil.showError, this);
                this._initFormStyles();

                this.applySettings(this.settings);

                return this;
            },

            previewOrder: function(){

                if (this.validateOrder()) {
                    var orderRequest = this.orderRequest;

                    // Launch TradePreviewWidget, passing in this object
                    this.addChildren([
                        {
                            id: 'TradePreviewWidget',
                            viewClass: TradePreviewWidget,
                            parentElement: $('body'),
                            options: {
                                model: new TradePreviewViewModel(orderRequest)
                            }
                        }
                    ]);

                    $('.modal-overlay').addClass('show');
                    $('.modal-overlay').addClass('stacked');
                }
            },

            render: function(){
                var template = this.getTemplate(),
                    settings = this.settings,
                    collection = this.collection || {},
                    applySettings = this.applySettings,
                    modalView = this,
                    context = {};

                collection.each(function(models){
                    models.attributes.valueFormatted = Formatter.formatMoney(models.attributes.marketValue);
                });

                // If the collection contains a toJSON method, call it to create the context
                context.accounts = collection.toJSON ? collection.toJSON() : [];
                context.settings = settings;

                // Destroy existing children
                this.destroyChildren();

                this.$el.html(template(context));
                this._setupElements();

                // Subscribe to events
                this.listenTo(MessageBus, Message.ModalLoad, function(){
                    applySettings(settings);
                });

                $(window).on('keyup', function(e) {
                  if (e.which === 27) { // Escape
                    modalView.closeModal();
                  }
                });

                this.postRender(settings);
                return this;
            },

            selectCheckbox: function(e) {
                e.preventDefault();

                var tradeWidget = this;

                var target = $(e.currentTarget);
                var $checkbox = $(':checkbox[value=' + target.attr('attr-value') + ']');

                if ( $checkbox.is(':checked') ) {
                    target.addClass('empty');
                    target.removeClass('selected icon-ok');
                    $checkbox.attr('checked', false);
                    tradeWidget.orderRequest.orderParams.allOrNone = false;
                } else {
                    target.removeClass('empty');
                    target.addClass('selected icon-ok');
                    $checkbox.attr('checked', true);
                    tradeWidget.orderRequest.orderParams.allOrNone = true;
                }

                this.createEstimate();

                return this;
            },

            selectDropdown: function(e) {

                var tradeWidget = this,
                    target = $(e.target),
                    name = $(target).attr('name');

                if ( name !== 'brokerageAccountId') {
                    tradeWidget.orderRequest.orderParams[name] = $(target).val();
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
                this._fetchMarketPrice(value);
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

            updateQuantity: function(e) {

              this.orderRequest.orderParams.quantity = $(e.currentTarget).val();
              this.createEstimate();

            },

            validateOrder: function() {
                var orderParams = this.orderRequest.orderParams;
                var isValid = orderParams.symbol &&
                    orderParams.quantity &&
                    (orderParams.type === 'Market' || (orderParams.type === 'Limit' && orderParams.hasOwnProperty('limitPrice') ));

                return isValid;
            },

            _fetchMarketPrice: function(symbol) {
                var tradeWidget = this;
                if (symbol && symbol !== '') {
                    this.marketPrice = new MarketPrice({symbol: symbol});
                    this.marketPrice.fetch({
                        success: function(price) {
                          tradeWidget._marketPriceFetched(price);
                          tradeWidget.orderRequest.orderParams.symbol = symbol;
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                          tradeWidget._marketPriceFetched(null);
                          ErrorUtil.showBackboneError(jqXHR, textStatus, errorThrown);
                        }
                    });
                } else {
                    this._marketPriceFetched(null);
                }
            },

            _initFormStyles: function(){
                $('#trade-accountId, #trade-orderType, #trade-term').selectbox();
            },

            _initSymbolField: function(data) {
                var tradeWidget = this;

                var instruments = $.map(data, function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });

                $('#trade-symbol').autocomplete({
                  source: function( request, response ) {
                    var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), 'i' );

                    response( $.grep( instruments, function( item ){
                        return matcher.test(item.label);
                    }) );
                  },
                  select: function( event, ui ) {
                    tradeWidget.symbolChanged(ui.item.value);
                  }
                });

                return instruments;
            },

            _marketPriceFetched: function(marketPrice) {
                var price = marketPrice ? Formatter.formatMoney(marketPrice.attributes.price) : '';
                $('#trade-form .lastPrice').html(price);
                $('#last-trade-price').val(price);

                this.createEstimate();

                /*new LastTradeView({
                    el: '#tradeForm_lastTrade',
                    model: this.marketPrice
                }).render();*/
            }

        });
    }
);