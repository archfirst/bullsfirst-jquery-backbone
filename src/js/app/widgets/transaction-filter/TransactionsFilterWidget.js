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

            elements:['transactionsFilterForm','transactionsFromDate','transactionsToDate','transactionsFilterAccountId'],

            events: {
                'click .transactions-filter .js-reset-filters-button' : 'resetFilters',
                'click .transactions-filter .js-apply-filters-button' : 'updateTransactions'
            },

            initialize: function() {

                this.listenTo(MessageBus, Message.UpdateTransactions, this.updateTransactions);
                this.listenTo(MessageBus, Message.FilterLoaded, this.onFilterLoad );
            },

            postPlace: function() {
                // instantiate fromDate to datepicker()
                $(this.transactionsFilterFormElement).validationEngine();

                if (!($(this.transactionsFromDateElement).datepicker())) {
                    $(this.transactionsFromDateElement).datepicker();
                }
                // instantiate ToDate to datepicker()
                if (!($(this.transactionsToDateElement).datepicker())) {
                    $(this.transactionsToDateElement).datepicker();
                }
                // Restore filters for the transactions tab
                this.setFilters( $(this.transactionsFilterFormElement), Repository.getTransactionsFilters()  );
                this.setFilterCriteria();
            },

            onFilterLoad: function() {
                $(this.transactionsFilterAccountIdElement).selectbox();
            },

            resetFilters: function() {
                this.closePopups();
                // Reset selectbox to ''
                $(this.transactionsFilterFormElement).find('select[name="accountId"]').selectbox('detach');
                $(this.transactionsFilterFormElement).find('select[name="accountId"]').val('');
                $(this.transactionsFilterFormElement).find('select[name="accountId"]').selectbox('attach');
                // Reset all the text inputs to ''
                $(this.transactionsFilterFormElement).find('input:text').prop('value', '');
                // Reset datepicker
                $(this.transactionsFromDateElement).datepicker('setDate', new Date());
                $(this.transactionsToDateElement).datepicker('setDate', new Date());
                // Save transactions filter criteria in Repository
                Repository.setTransactionsFilterCriteria( $(this.transactionsFilterFormElement).toObject() );
                // Update transactions for reset filter criteria
                this.updateTransactions();
            },
            // Set the selected filter criteria and save it in Repository
            setFilterCriteria: function() {
                // get selected filter values in orderFilterForm to a object
                var filtercriteria = $(this.transactionsFilterFormElement).toObject();
                if (filtercriteria.fromDate) {
                    filtercriteria.fromDate = moment(new Date(filtercriteria.fromDate)).format('YYYY-MM-DD');
                }
                if (filtercriteria.toDate) {
                    filtercriteria.toDate = moment(new Date(filtercriteria.toDate)).format('YYYY-MM-DD');
                }
                // save selected filter criteria in Repository
                Repository.setTransactionsFilterCriteria( filtercriteria );
            },

            updateTransactions: function() {
                // Process filter criteria to server format
                if (!($(this.transactionsFilterFormElement).validationEngine('validate'))) {
                    return;
                }
                this.closePopups();
                this.setFilterCriteria();
                Repository.getTransactions();
            },

            closePopups: function(){
                $(this.transactionsFilterFormElement).validationEngine('hideAll');
                $(this.transactionsFromDateElement).datepicker('hide');
                $(this.transactionsToDateElement).datepicker('hide');
            },

            //override destrory of base view to remove popups
            destroy: function() {
                this.closePopups();
                // call to super class destroy function
                BaseView.prototype.destroy.call(this);
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