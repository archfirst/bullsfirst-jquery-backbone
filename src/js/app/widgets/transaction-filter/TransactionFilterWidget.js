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
 * app/widgets/transaction-filter/TransactionFilterWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/Repository',
        'app/framework/Message',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'moment',
        'text!app/widgets/transaction-filter/TransactionFilterTemplate.html',
        'select2',
        'stickit',
        'validation'
    ],
    function(Repository, Message, Backbone, BaseView, MessageBus, moment, TransactionFilterTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',
            className: 'transaction-filter',

            template: {
                name: 'TransactionFilterTemplate',
                source: TransactionFilterTemplate
            },

            elements:['form', 'fromDate', 'toDate', 'account', 'resetButton', 'applyFiltersButton'],

            events: {
                'click .reset-filters-button': 'resetFilters',
                'click .apply-filters-button': 'applyFilters'
            },

            bindings: {
                '.js-account': {
                    observe: 'accountId',
                    selectOptions: {
                        collection: Repository.getBrokerageAccounts(),
                        labelPath: 'name',
                        valuePath: 'id',
                        defaultOption: {
                            label: 'All Accounts',
                            value: null
                        }
                    },
                    setOptions: { validate: true }
                }
            },

            initialize: function() {
                this.model = Repository.getTransactionFilterCriteria();
                this.listenTo(MessageBus, Message.UpdateTransactions, this.updateTransactions);
            },

            resetFilters: function() {
                Repository.resetTransactionFilterCriteria();
            },

            applyFilters: function() {
                Repository.fetchTransactions();
            },

            postRender: function() {
                this.stickit();
            }
        });
    }
);