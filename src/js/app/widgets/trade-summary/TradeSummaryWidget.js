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
 * app/widgets/trade/TradeSummaryWidget
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/services/InstrumentService',
        'app/widgets/modal/ModalWidget',
        'app/widgets/trade/TradeView',
        'framework/ErrorUtil',
        'framework/MessageBus'
    ],
    function(Message, Repository, InstrumentService, ModalWidget, TradeView, ErrorUtil, MessageBus) {
        'use strict';

        return ModalWidget.extend({
            id: 'trade-modal',
            className: 'modal-wrapper right',

            initialize: function() {

                //this.listenTo(this.model, 'change', this.render);
                $.extend( this.settings, {
                    id: this.id,
                    title: 'Trade',
                    type: 'trade',
                    draggable: true
                });
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'TradeView',
                        viewClass: TradeView,
                        parentElement: this.$el,
                        options: {
                            collection: Repository.getBrokerageAccounts()
                        }
                    }
                ]);
                
            },

            postPlace: function(){
                MessageBus.trigger(Message.ModalLoad);

                // init the symbol autocomplete field
                InstrumentService.getInstruments(this._initSymbolField, ErrorUtil.showError);
                this._initFormStyles();
            },

            _initFormStyles: function(){
                $('#trade-accountId').selectbox();
                $('#trade-orderType').selectbox();
                $('#trade-term').selectbox();
            },

            _initSymbolField: function(data) {
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
                    MessageBus.trigger(Message.TradeSymbolChange, ui.item.value);
                  }
                });

                return instruments;
            }
        });
    }
);