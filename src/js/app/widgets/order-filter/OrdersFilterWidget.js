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
        'text!app/widgets/order-filter/OrdersFilterTemplate.html',
        'jqueryselectbox'
    ],
    function(Message, Repository, FilterWidget, Backbone, BaseView, MessageBus, moment, OrdersFilterTemplate) {
        'use strict';

        return FilterWidget.extend({
            tagName: 'div',
            className: 'orders',

            tab: 'orders',

            template: {
                name: 'OrderssFilterTemplate',
                source: OrdersFilterTemplate
            },

            elements:['ordersFilterForm','ordersFilterSymbol', 'ordersFromDate', 'ordersToDate'],

            events: {
                'click #orders-filter .js-reset-filters-button' : 'resetFilters',
                'click #orders-filter .js-apply-filters-button' : 'updateOrders'
            },

            initialize: function() {
                
                this.listenTo(MessageBus, Message.UpdateOrders, this.updateOrders );
            },

            postPlace: function() {
                // initialize Symbol dropdown
                this._initSymbolField();
                // Add selectbox to account id selectlist
                if (!($(this.ordersFilterFormElement).find('select[name="accountId"]').selectbox())){
                    $(this.ordersFilterFormElement).find('select[name="accountId"]').selectbox();
                }
                // instantiate fromDate to datepicker()
                if (!($(this.ordersFromDateElement).datepicker())) {
                    $(this.ordersFromDateElement).datepicker();
                }
                // instantiate ToDate to datepicker()
                if (!($(this.ordersToDateElement).datepicker())) {
                    $(this.ordersToDateElement).datepicker();
                }
                // Initially set fromDate and ToDate to current date
                $(this.ordersFromDateElement).datepicker('setDate', new Date());
                $(this.ordersToDateElement).datepicker('setDate', new Date());
                // Restore filters for the orders tab
                if ( !(_.isEmpty( Repository.getOrderFilters() )) ) {
                    this.setFilters( $(this.ordersFilterFormElement), Repository.getOrderFilters()  );
                }
                this.setFilterCriteria();
            },

            resetFilters: function() {
                // Reset selectbox to ''
                $(this.ordersFilterFormElement).find('select[name="accountId"]').selectbox('detach');
                $(this.ordersFilterFormElement).find('select[name="accountId"]').val('');
                $(this.ordersFilterFormElement).find('select[name="accountId"]').selectbox('attach');
                // Reset all the text inputs to ''
                $(this.ordersFilterFormElement).find('input:text').prop('value', '');
                // Reset datepicker
                $(this.ordersFromDateElement).datepicker('setDate', new Date());
                $(this.ordersToDateElement).datepicker('setDate', new Date());
                // Resest all the checkboxes in formelement to false
                $(this.ordersFilterFormElement).find('input:checkbox').prop('checked', false);
                // Save order filter criteria in Repository
                Repository.setOrderFilterCriteria( $(this.ordersFilterFormElement).toObject() );
                // Update Orders for reset filter criteria
                this.updateOrders();
            },
            // Set the selected filter criteria and save it in Repository
            setFilterCriteria: function() {
                // get selected filter values in orderFilterForm to a object
                var filtercriteria = $(this.ordersFilterFormElement).toObject();
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
                this.setFilterCriteria();
                Repository.getOrders();
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
            // initialize symbol dropdown with instruments
            _initSymbolField: function() {
                
                var instruments = $.map(Repository.getInstruments(), function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });

                $(this.ordersFilterSymbolElement).autocomplete({
                  source: instruments
                });

                return instruments;
      
            }
        });
    }
);