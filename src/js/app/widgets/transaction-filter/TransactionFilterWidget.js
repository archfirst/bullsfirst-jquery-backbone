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
        'app/widgets/filter/FilterWidget',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'moment',
        'text!app/widgets/transaction-filter/TransactionFilterTemplate.html',
        'jqueryselectbox'
    ],
    function(Repository, Message, FilterWidget, Backbone, BaseView, MessageBus, moment, TransactionFilterTemplate) {
        'use strict';

        return FilterWidget.extend({
            tagName: 'div',
            className: 'transaction-filter',

            template: {
                name: 'TransactionFilterTemplate',
                source: TransactionFilterTemplate
            },

            elements:['form', 'fromDate', 'toDate', 'account', 'resetButton', 'applyFiltersButton'],

            events: {
                'click .reset-filters-button': 'resetFilters',
                'click .apply-filters-button': 'updateTransactions'
            },

            initialize: function() {
                this.listenTo(MessageBus, Message.UpdateTransactions, this.updateTransactions);
                this.listenTo(MessageBus, Message.FilterLoaded, this.onFilterLoad );
            },

            postPlace: function() {
                $(this.formElement).validationEngine();

                // instantiate fromDate to datepicker()
                if (!($(this.fromDateElement).datepicker())) {
                    $(this.fromDateElement).datepicker();
                }
                // instantiate ToDate to datepicker()
                if (!($(this.toDateElement).datepicker())) {
                    $(this.toDateElement).datepicker();
                }
                // Restore filters for the transactions tab
                this.setFilters( $(this.formElement), Repository.getTransactionFilters()  );

                this.setFilterCriteria();
            },

            onFilterLoad: function() {
                $(this.accountElement).selectbox();
            },

            resetFilters: function() {
                this.closePopups();
                // Reset selectbox to ''
                this.accountElement.selectbox('detach');
                this.accountElement.val('');
                this.accountElement.selectbox('attach');
                // Reset all the text inputs to ''
                $(this.formElement).find('input:text').prop('value', '');
                // Reset datepicker
                $(this.fromDateElement).datepicker('setDate', new Date());
                $(this.toDateElement).datepicker('setDate', new Date());
                // Save transaction filter criteria in Repository
                Repository.setTransactionFilterCriteria( $(this.formElement).toObject() );
                // Update transactions for reset filter criteria
                this.updateTransactions();
            },

            // Set the selected filter criteria and save it in Repository
            setFilterCriteria: function() {
                // get selected filter values in form to a object
                var filtercriteria = $(this.formElement).toObject();
                if (filtercriteria.fromDate) {
                    filtercriteria.fromDate = moment(new Date(filtercriteria.fromDate)).format('YYYY-MM-DD');
                }
                if (filtercriteria.toDate) {
                    filtercriteria.toDate = moment(new Date(filtercriteria.toDate)).format('YYYY-MM-DD');
                }
                // save selected filter criteria in Repository
                Repository.setTransactionFilterCriteria( filtercriteria );
            },

            // update transactions for current filter criteria
            updateTransactions: function() {
                // Process filter criteria to server format
                if (!($(this.formElement).validationEngine('validate'))) {
                    return;
                }
                this.closePopups();
                this.setFilterCriteria();
                Repository.getTransactions();
            },

            closePopups: function(){
                $(this.formElement).validationEngine('hideAll');
                $(this.fromDateElement).datepicker('hide');
                $(this.toDateElement).datepicker('hide');
            },

            //override destrory of base view to remove popups
            destroy: function() {
                this.closePopups();
                // call to super class destroy function
                BaseView.prototype.destroy.call(this);
            },

            render: function() {
                this.destroyChildren();

                var template = this.getTemplate();
                var context = {
                    accounts: this.collection.toJSON()
                };
                this.$el.html(template(context));

                this._setupElements();
                this.postRender();

                return this;
            }
        });
    }
);