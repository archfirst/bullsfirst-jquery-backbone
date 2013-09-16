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
 * app/widgets/transaction-table/TransactionTableWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/Repository',
        'app/domain/Transactions',
        'app/framework/Message',
        'app/widgets/transaction-table/TransactionTableView',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/transaction-table/TransactionTableTemplate.html'
    ],
    function(Repository, Transactions, Message, TransactionTableView,
        BaseView, MessageBus, TransactionTableTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',

            template: {
                name: 'TransactionTableTemplate',
                source: TransactionTableTemplate
            },

            initialize: function(){
                this.collection = Repository.getTransactions();
                this.collection.bind('reset', this.render, this);
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'TransactionTableView',
                        viewClass: TransactionTableView,
                        options: {
                            el: this.$el.find('tbody'),
                            tab: 'transactions',
                            collection: this.collection
                        }
                    }
                ]);
            }
        });
    }
);