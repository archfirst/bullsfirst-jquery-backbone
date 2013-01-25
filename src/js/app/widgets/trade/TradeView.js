/**
 * Copyright 2012 Archfirst
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
 * app/widgets/modal/ModalView
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/MarketPrice',
        'framework/BaseView',
        'framework/ErrorUtil',
        'framework/Formatter',
        'framework/MessageBus',
        'jquery',
        'moment',
        'text!app/widgets/trade/TradeTemplate.html',
        'jqueryselectbox'
    ],
    
    function( Message, MarketPrice, BaseView, ErrorUtil, Formatter, MessageBus, $, moment, TradeTemplate ) {
        'use strict';
        

        return BaseView.extend({

			tagName: 'section',

            template: {
                name: 'TradeTemplate',
                source: TradeTemplate
            },

            events: {
                'click #trade-form .modal-radio' : 'selectRadio',
                'click #trade-form .modal-checkbox' : 'selectCheckbox',
                'change #trade-orderType' : 'toggleLimitField',
                'click #trade-preview-order' : 'previewOrder'
            },

            initialize: function(){
				this.render();
                //this.collection.bind('reset', this.render, this);
                this.listenTo(MessageBus, Message.TradeSymbolChange, this.symbolChanged);
			},

            render: function(){
                var template = this.getTemplate(),
                    collection = this.collection || {},
                    context = {};

                collection.each(function(models){
                    models.attributes.valueFormatted = Formatter.formatMoney(models.attributes.marketValue);
                });

                // If the collection contains a toJSON method, call it to create the context
                context.accounts = collection.toJSON ? collection.toJSON() : [];

                // Destroy existing children
                this.destroyChildren();

                this.$el.html(template(context));
                this._setupElements();

                this.postRender();
                return this;
            },

            selectCheckbox: function(e) {
                var $checkbox = $(':checkbox[value=' + $(e.target).attr('attr-value') + ']');
                
                // Add selected
                if ( $(e.target).hasClass('selected icon-ok') ) {
                    $(e.target).removeClass('selected icon-ok');
                } else {
                    $(e.target).addClass('selected icon-ok');
                }

                if ( $checkbox.is(':checked') ) {
                    $checkbox.attr('checked', false);
                } else {
                    $checkbox.attr('checked', true);
                }
            },

            selectRadio: function(e){
                // Update pseudo-buttons
                $(e.target).siblings('a.selected').removeClass('selected');
                $(e.target).addClass('selected');

                // Update radio buttons
                $(':radio[value=' + $(e.target).attr('attr-value') + ']').siblings().attr('checked', false);
                $(':radio[value=' + $(e.target).attr('attr-value') + ']').attr('checked', true);
            },

            toggleLimitField: function(e){
                if ( $(e.target).val().toLowerCase() === 'limit' ) {
                    $('.limit-price').removeClass('hidden');
                } else {
                    $('.limit-price').addClass('hidden');
                }
            },

            previewOrder: function(){
                var obj = $('#trade-form').serializeArray(),
                    newObj = {};
                $(obj).each( function(){
                    newObj[this.name] = this.value;
                });
                
                // TODO: launch TradePreviewWidget, passing in this object
            },

            symbolChanged: function(value) {
                this._fetchMarketPrice(value);
            },
            
            _fetchMarketPrice: function(symbol) {
                this.marketPrice = new MarketPrice({symbol: symbol});
                this.marketPrice.fetch({
                    success: this._marketPriceFetched,
                    error: ErrorUtil.showBackboneError
                });
            },

            _marketPriceFetched: function(marketPrice) {
                var price = Formatter.formatMoney(marketPrice.attributes.price);
                $('#trade-form .lastPrice').html(price);
                $('#last-trade-price').val(price);

                /*new LastTradeView({
                    el: '#tradeForm_lastTrade',
                    model: this.marketPrice
                }).render();*/
            }
            
        });
    }
);