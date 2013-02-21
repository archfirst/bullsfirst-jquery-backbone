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
 * app/widgets/transaction-table/TransactionsTableWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/domain/Transactions',
        'app/widgets/transaction-table/TransactionsTableView',
        'framework/BaseView',
        'framework/MessageBus',
        'text!app/widgets/transaction-table/TransactionsTableTemplate.html'
    ],
    function(Message, Repository, Transactions, TransactionsTableView,
        BaseView, MessageBus, TransactionsTableTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',

            template: {
                name: 'TransactionsTableTemplate',
                source: TransactionsTableTemplate
            },

            initialize: function(){
                
                this.collection = Repository.getTransactions();
                this.collection.bind('reset', this.render, this);
                // Subscribe to events
                this.listenTo(MessageBus, Message.TransactionFilterChanged, function(filterCriteria) {
                    this.collection.fetch({data: filterCriteria});
                });

            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'TransactionsTableView',
                        viewClass: TransactionsTableView,
                        el: '.transactions-table tbody',
                        options: {
                            el: '.transactions-table tbody',
                            tab: 'transactions',
                            collection: this.collection
                        }
                    }
                ]);
            }
        });
    }
);