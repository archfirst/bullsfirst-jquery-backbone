/**
 * Copyright 2012 Archfirst
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
 * app/widgets/order-table/OrdersTableView
 *
 * @author Sreejesh Karunakaran
 */
define(
    [
        'app/common/Message',
        'app/widgets/order-table/OrderView',
        'framework/BaseView',
        'framework/Formatter',
        'framework/MessageBus',
        'moment'
    ],
    
    function( Message, OrderView, BaseView, Formatter, MessageBus, moment ) {
        'use strict';
        

        return BaseView.extend({

            initialize: function(){

				this.collection.bind('reset', this.render, this);

				// Subscribe to events
				MessageBus.on('OrderFilterChanged', function(filterCriteria) {
					this.collection.fetch({data: filterCriteria});
				}, this);
                
                this.collection.fetch();

				this.render();
			},

			render: function(){

                var orders = this.collection;

                $(this.options.el).html('');

                // Create new views for each transaction
                orders.each( function(model) {
                    this.renderOrder(model);
                }, this);

                return this;

			},

            renderOrder: function(order){
                
                var className = (order.attributes.status === 'Canceled')? 'faded' : '';
                
                // Format order values for display
                order.attributes.creationTimeFormatted = Formatter.formatDateTime( moment(order.attributes.creationTime) );
                order.attributes.limitPriceFormatted = Formatter.formatMoney(order.attributes.limitPrice);
                order.attributes.executionPriceFormatted = Formatter.formatMoney(order.attributes.executions.price);
                
                var view = this.addChild({
                    id: order.id,
                    viewClass: OrderView,
                    parentElement: this.$el.selector,
                    options: {
                        model: order,
                        className: className
                    }
                });

                return view;
            }

        });
    }
);