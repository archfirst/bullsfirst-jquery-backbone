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
 * app/widgets/order-filter/OrderFilterWidget
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
        'text!app/widgets/order-filter/OrderFilterTemplate.html',
        'jqueryselectbox'
    ],
    function(Repository, Message, FilterWidget, Backbone, BaseView, MessageBus, moment, OrderFilterTemplate) {
        'use strict';

        return FilterWidget.extend({
            tagName: 'div',
            className: 'order-filter',

            template: {
                name: 'OrderFilterTemplate',
                source: OrderFilterTemplate
            },

            elements:['form', 'symbol', 'fromDate', 'toDate', 'account', 'resetButton', 'applyFiltersButton'],

            events: {
                'click .reset-filters-button': 'resetFilters',
                'click .apply-filters-button': 'updateOrders'
            },

            initialize: function() {
                this.listenTo(MessageBus, Message.UpdateOrders, this.updateOrders );
            },

            postPlace: function() {
                // initialize Symbol dropdown
                this._initSymbolField();

                $(this.formElement).validationEngine();

                // instantiate fromDate to datepicker()
                if (!($(this.fromDateElement).datepicker())) {
                    $(this.fromDateElement).datepicker();
                }
                // instantiate ToDate to datepicker()
                if (!($(this.toDateElement).datepicker())) {
                    $(this.toDateElement).datepicker();
                }
                // Restore filters for the orders tab
                this.setFilters( $(this.formElement), Repository.getOrderFilters()  );

                this.setFilterCriteria();
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
                // Resest all the checkboxes in formelement to false
                $(this.formElement).find('input:checkbox').prop('checked', false);
                // Save order filter criteria in Repository
                Repository.setOrderFilterCriteria( $(this.formElement).toObject() );
                // Update Orders for reset filter criteria
                this.updateOrders();
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
                if (filtercriteria.sides) {
                    filtercriteria.sides = filtercriteria.sides.join(',');
                }
                if (filtercriteria.statuses){
                    filtercriteria.statuses = filtercriteria.statuses.join(',');
                }
                // save selected filter criteria in Repository
                Repository.setOrderFilterCriteria( filtercriteria );
            },

            // update orders for current filter criteria
            updateOrders: function() {
                // Process filter criteria to server format
                if (!($(this.formElement).validationEngine('validate'))) {
                    return;
                }
                this.closePopups();
                this.setFilterCriteria();
                Repository.getOrders();
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
            },

            // initialize symbol dropdown with instruments
            _initSymbolField: function() {

                var instruments = $.map(Repository.getInstruments(), function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });

                $(this.symbolElement).autocomplete({
                    source: instruments
                });

                return instruments;

            }
        });
    }
);