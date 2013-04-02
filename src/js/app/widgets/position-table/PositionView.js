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
 * app/widgets/position-table/PositionView
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/position-table/PositionTemplate.html'
    ],
    function(Message, BaseView, MessageBus, PositionTemplate) {
        'use strict';

        return BaseView.extend({

            tagName: 'tr',

            template: {
                name: 'PositionTemplate',
                source: PositionTemplate
            },

            events: {
                'click .pos_trade': 'requestTrade'
            },

            // Constructor options:
            //   model: position that needs to be displayed
            //   id: unique id of the DOM element,
            //   className: (for lots only) 'child-of-' + DOM id of parent instrument position
            // initialize: function() {
            // },

            requestTrade: function(event) {
                MessageBus.trigger(Message.TradeRequest, {
                    action: $(event.target).data('action'),
                    quantity: this.model.get('quantity'),
                    symbol: this.model.get('instrumentSymbol')
                });

                return false;
            }
        });
    }
);