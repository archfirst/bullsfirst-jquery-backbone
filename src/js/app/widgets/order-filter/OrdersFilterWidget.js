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

            elements:['ordersfilterform','orderfiltersymbol'],

            events: {
                'click #orders-filter .js-reset-filters-button' : 'resetFilters',
                'click #orders-filter .js-apply-filters-button' : 'updateOrders'
            },

            initialize: function() {

                FilterWidget.prototype.initialize.call(this);
                
                this.listenTo(MessageBus, Message.UpdateOrders, function(){
                    this.updateOrders();
                });
                
            },

            postPlace: function() {
               this._initSymbolField();
            },
            
            resetFilters: function() {
                //selectbox and datepicker reset inhertied from the filterWidget
                $(this.ordersfilterformElement).find('#orders-filter-accountId').prop('selectedIndex', 0);
                $(this.ordersfilterformElement).find('input:text').prop('value', '');
                $(this.ordersfilterformElement).find('#orders-fromDate').datepicker('setDate', new Date());
                $(this.ordersfilterformElement).find('#orders-toDate').datepicker('setDate', new Date());
                $(this.ordersfilterformElement).find('input:checkbox').prop('checked', false);
                this.updateOrders();
            },
            
            updateOrders: function() {
                // Process filter criteria to server format
                this.updateFilters($(this.ordersfilterformElement));
                //var filterCriteria = $(this.ordersfilterformElement).toObject();
                if (this.filterCriteria.fromDate) {
                    this.filterCriteria.fromDate = moment($('#orders-fromDate').datepicker('getDate')).format('YYYY-MM-DD');
                }
                if (this.filterCriteria.toDate) {
                    this.filterCriteria.toDate = moment($('#orders-fromDate').datepicker('getDate')).format('YYYY-MM-DD');
                }
                if (this.filterCriteria.sides) {
                    this.filterCriteria.sides = this.filterCriteria.sides.join(',');
                }
                if (this.filterCriteria.statuses) {
                    this.filterCriteria.statuses = this.filterCriteria.statuses.join(',');
                }
                // Send OrderFilterChanged message with filter criteria
                MessageBus.trigger(Message.OrderFilterChanged,this.filterCriteria);
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

            _initSymbolField: function() {
                
                var instruments = $.map(Repository.getInstruments(), function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });

                $(this.orderfiltersymbolElement).autocomplete({
                  source: instruments
                });

                return instruments;
      
            }
        });
    }
);