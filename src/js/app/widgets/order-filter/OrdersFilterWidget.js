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

            events: {
                'click #orders-filter .js-reset-filters-button' : 'triggerReset',
                'click #orders-filter .js-apply-filters-button' : 'triggerApply'
            },

            triggerReset: function() {
                MessageBus.trigger(Message.OrderFilterReset, this.className);
                return false;
            },

            triggerApply: function(){
                MessageBus.trigger(Message.OrderFilterApply, this.className);
                return false;
            },
            
            postRender: function(){
                MessageBus.on(Message.OrderFilterReset, this.resetFilter, this);
                MessageBus.on(Message.OrderFilterApply, this.updateOrders, this);
            },
            
            resetFilter: function(tab) {
                //selectbox and datepicker reset inhertied from the filterWidget
                this.resetSelectbox(tab);
				this.resetDatepicker(tab);
                this.resetOrderId();
                this.resetSymbol();
                this.resetOrderAction();
                this.resetOrderStatus();
			},
            
            
            resetOrderId: function(){
                $('#order-filter-orderno').val('');
            },
            resetSymbol: function(){
                $('#order-filter-symbol').val('');
            },
            resetOrderAction: function(){
                
                $('#order-filter-action li input[type="checkbox"]').attr('checked', false);
            },
            resetOrderStatus: function(){
                $('#order-filter-status li input[type="checkbox"]').attr('checked', false);
            },
            
            updateOrders: function( tab ) {
                // Process filter criteria to server format
				var filterCriteria = {},
                    orderId = $('#order-filter-orderno').val(),
                    accountId = $('#orders-filter-accountId').val(),
                    symbol = $('#order-filter-symbol').val(),
                    sides,
                    statuses;

                if ( accountId > 0 ) {
                    filterCriteria.accountId = accountId;
                }

                if ( orderId > 0 ) {
                    filterCriteria.orderId = orderId;
                }
                                
                statuses = $.map($('#order-filter-status li input[type="checkbox"]:checked'), function(n){
                    return n.value;
                }).join(',');
                
                sides = $.map($('#order-filter-action li input[type="checkbox"]:checked'), function(n){
                    return n.value;
                }).join(',');
                
                if(statuses){
                    filterCriteria.statuses = statuses;
                }
                
                if(symbol){
                    filterCriteria.symbol = symbol;
                }
                
                if(sides){
                    filterCriteria.sides = sides;
                }

				if ( $('#' + tab + '-fromDate').val().length > 0 ) {
					filterCriteria.fromDate = moment( $('#' + tab + '-fromDate').datepicker('getDate') ).format('YYYY-MM-DD');
				}

				if ( $('#' + tab + '-toDate').val().length > 0 ) {
					filterCriteria.toDate = moment( $('#' + tab + '-toDate').datepicker('getDate') ).format('YYYY-MM-DD');
				}

				// Send OrderFilterChanged message with filter criteria
				MessageBus.trigger('OrderFilterChanged', filterCriteria);
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