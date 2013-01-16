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
 * bullsfirst/views/PositionView
 *
 * @author Naresh Bhatia
 */

define(
    [
        'backbone',
        'app/domain/Position',
        'app/domain/Repository',
        'framework/Formatter',
        'framework/MessageBus',
        'bullsfirst/views/TemplateManager',
        'moment'
    ],
    function(Backbone, Position, Repository, Formatter, MessageBus, TemplateManager, moment) {
        'use strict';

        return Backbone.View.extend({

            tagName: 'tr',

            events: {
                'click .pos_trade': 'requestTrade'
            },

            requestTrade: function(event) {
                MessageBus.trigger('TradeRequest', {
                    action: $(event.target).data('action'),
                    quantity: this.model.get('quantity'),
                    symbol: this.model.get('instrumentSymbol')
                });

                return false;
            },

            render: function() {
                // Format position values for display
                var position = this.model.toJSON();  // returns a copy of the model's attributes
                position.lotCreationTimeFormatted = Formatter.formatMoment2Date(moment(position.lotCreationTime));
                position.marketValueFormatted = Formatter.formatMoney(position.marketValue);
                position.lastTradeFormatted = Formatter.formatMoney(position.lastTrade);
                position.pricePaidFormatted = Formatter.formatMoney(position.pricePaid);
                position.totalCostFormatted = Formatter.formatMoney(position.totalCost);
                position.gainFormatted = Formatter.formatMoney(position.gain);
                position.gainPercentFormatted = Formatter.formatPercent(position.gainPercent);

                // Set up flags for conditionals
                position.isInstrumentPosition = typeof position.lotId === 'undefined';
                position.isLot = !position.isInstrumentPosition;
                position.isTradable = position.isInstrumentPosition && position.instrumentSymbol !== 'CASH';

                // Render using template
                var hash = {position: position};
                
                var template = TemplateManager.getTemplate('position');
                $(this.el).html(template(hash));

                return this;
            }
        });
    }
);