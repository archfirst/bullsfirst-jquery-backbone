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
 * app/pages/transactions/TransactionsTab
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/Repository',
        'app/widgets/transaction-filter/TransactionsFilterWidget',
        'app/widgets/transaction-table/TransactionsTableWidget',
        'keel/BaseView',
        'text!app/pages/transactions/TransactionsTabTemplate.html'
    ],
    function(Repository, TransactionsFilterWidget, TransactionsTableWidget, BaseView, TransactionsTabTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            className: 'transactions-tab tab clearfix',

            template: {
                name: 'TransactionsTabTemplate',
                source: TransactionsTabTemplate
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'TransactionsFilterWidget',
                        viewClass: TransactionsFilterWidget,
                        parentElement: this.$el,
                        options: {
                            collection: Repository.getBrokerageAccounts()
                        }
                    }, {
                        id: 'TransactionsTableWidget',
                        viewClass: TransactionsTableWidget,
                        parentElement: this.$el,
                        options: {
                            model: Repository.getBrokerageAccounts()
                        }
                    }
                ]);
            }
        });
    }
);