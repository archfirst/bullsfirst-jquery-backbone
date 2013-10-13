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
 * app/domain/OrderRequest
 *
 * Attributes:
 *   brokerageAccountId: int
 *   symbol: string
 *   side: 'Buy' | 'Sell'
 *   quantity: int
 *   type: 'Market' | 'Limit'
 *   limitPrice: float
 *   term: 'GoodForTheDay' | 'GoodTilCanceled'
 *   allOrNone: boolean
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone',
        'validation'
    ],
    function(Backbone) {
        'use strict';

        return Backbone.Model.extend({

            defaults: {
                'side': 'Buy',
                'type': 'Market',
                'term': 'GoodForTheDay',
                'allOrNone': false
            },

            validation: {
                brokerageAccountId: [
                    {
                        required: true
                    },
                    {
                        pattern: 'number'
                    }
                ],
                symbol: {
                    required: true
                },
                side: {
                    required: true
                },
                type: {
                    required: true
                },
                quantity: [
                    {
                        required: true
                    },
                    {
                        pattern: 'number'
                    }
                ],
                limitPrice: [
                    {
                        required: function(value, attr, computedState) {
                            return (computedState.type === 'Limit') ? true : false;
                        }
                    },
                    {
                        pattern: 'number'
                    }
                ],
                term: {
                    required: true
                },
                allOrNone: {
                    required: true
                }
            },

            toServerRequest: function() {
                var request = {
                    brokerageAccountId: this.get('brokerageAccountId'),
                    orderParams: {
                        side: this.get('side'),
                        symbol: this.get('symbol').toUpperCase(),
                        quantity: this.get('quantity'),
                        type: this.get('type'),
                        term: this.get('term'),
                        allOrNone: this.get('allOrNone')
                    }
                };

                if (this.get('type') === 'Limit') {
                    request.limitPrice = {
                        amount: this.get('limitPrice'),
                        currency: 'USD'
                    };
                }

                return request;
            }
        });
    }
);