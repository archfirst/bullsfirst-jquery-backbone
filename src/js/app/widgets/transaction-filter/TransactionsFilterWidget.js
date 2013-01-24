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
 * app/widgets/transactions/TransactionsFilterWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/widgets/filter/FilterView',
        'backbone',
        'framework/BaseView',
        'framework/MessageBus',
        'text!app/widgets/transaction-filter/TransactionsFilterTemplate.html',
        'jqueryselectbox'
    ],
    function(Message, Repository, FilterView, Backbone, BaseView, MessageBus, TransactionsFilterTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',
            className: 'transactions',

            template: {
                name: 'TransactionsFilterTemplate',
                source: TransactionsFilterTemplate
            },

            events: {
                'click #transactions-filter .js-reset-filters-button' : 'resetFilter',
                'click #transactions-filter .js-apply-filters-button' : 'applyFilter'
            },

            resetFilter: function() {
                MessageBus.trigger(Message.TransactionFilterReset, this.className);
                return false;
            },

            applyFilter: function(){
                MessageBus.trigger(Message.TransactionFilterApply, this.className);
                return false;
            },

            initialize: function() {
                // Subscribe to events
            },

            render: function(){
                var template = this.getTemplate(),
                    collection = this.collection || {},
                    context = {};

                // If the collection contains a toJSON method, call it to create the context
                context.accounts = collection.toJSON ? collection.toJSON() : [];

                // Destroy existing children
                this.destroyChildren();

                this.$el.html(template(context));
                this._setupElements();

                this.postRender();
                return this;
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'TransactionsFilterView',
                        viewClass: FilterView,
                        parentElement: this.$el,
                        options: {
                            el: '#transactions-filter',
                            tab: 'transactions',
                            collection: Repository.getBrokerageAccounts()
                        }
                    }
                ]);
            }
        });
    }
);