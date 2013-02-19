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
 * app/widgets/transaction-filter/TransactionsFilterWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/widgets/filter/FilterWidget',
        'backbone',
        'framework/BaseView',
        'framework/MessageBus',
        'moment',
        'text!app/widgets/transaction-filter/TransactionsFilterTemplate.html',
        'jqueryselectbox'
    ],
    function(Message, Repository, FilterWidget, Backbone, BaseView, MessageBus, moment, TransactionsFilterTemplate) {
        'use strict';

        return FilterWidget.extend({
            tagName: 'div',
            className: 'transactions',

            tab: 'transactions',

            template: {
                name: 'TransactionsFilterTemplate',
                source: TransactionsFilterTemplate
            },

            elements:['transactionsFilterForm'],

            events: {
                'click .transactions-filter .js-reset-filters-button' : 'resetFilters',
                'click .transactions-filter .js-apply-filters-button' : 'updateTransactions'
            },

            defaultFilterCriteria: {
               accountId:'',
               fromDate: moment(new Date()).format('YYYY-MM-DD'),
               toDate: moment(new Date()).format('YYYY-MM-DD')
            },
            initialize: function() {
                FilterWidget.prototype.initialize.call(this);
                this.listenTo(MessageBus, Message.UpdateTransactions, this.updateTransactions);
                this.listenTo(MessageBus, Message.FilterLoaded, this.transactionsFilterLoad );
            },

            resetFilters: function() {
                //selectbox and datepicker reset inhertied from the filterWidget
                Repository.setTransactionsFilterCriteria( this.defaultFilterCriteria );
                this.setFilters( $(this.transactionsFilterFormElement), Repository.getTransactionsFilters() );
                this.updateTransactions();
            },

            setFilterCriteria: function() {
                var filtercriteria = $(this.transactionsFilterFormElement).toObject();
                if (filtercriteria.fromDate) {
                    filtercriteria.fromDate = moment(new Date(filtercriteria.fromDate)).format('YYYY-MM-DD');
                }
                if (filtercriteria.toDate) {
                    filtercriteria.toDate = moment(new Date(filtercriteria.toDate)).format('YYYY-MM-DD');
                }
                 Repository.setTransactionsFilterCriteria( filtercriteria );
            },

            transactionsFilterLoad: function() {

                if ( _.isEmpty( Repository.getTransactionsFilters() ) ) {
                    this.setFilterCriteria();
                }
                else {
                    this.setFilters( $(this.transactionsFilterFormElement), Repository.getTransactionsFilters() );
                }
                
                Repository.getTransactions();
            },

            updateTransactions: function() {
                // Process filter criteria to server format
                this.setFilterCriteria();
                Repository.getTransactions();
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
            }
        });
    }
);