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
 * app/widgets/order-table/OrdersTableWidget
 *
 * @author Sreejesh Karunakaran
 */
define(
    [
        'app/common/Message',
        'app/domain/Orders',
        'app/widgets/order-table/OrdersTableView',
        'framework/BaseView',
        'framework/MessageBus',
        'text!app/widgets/order-table/OrdersTableTemplate.html',
        'jqueryTreeTable'
    ],
    function(Message, Orders, OrdersTableView, BaseView, MessageBus, OrdersTableTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'table',
            className: 'orders-table bf-table',
            elements: ['ordersTableBody'],

            template: {
                name: 'OrdersTableTemplate',
                source: OrdersTableTemplate
            },

            initialize: function() {

                this.collection = new Orders();
                this.collection.bind('reset', this.render, this);

                // Subscribe to events
                this.listenTo(MessageBus, Message.OrderFilterChanged, function(filterCriteria) {
                    this.collection.fetch({data: filterCriteria});
                });
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'OrdersTableView',
                        viewClass: OrdersTableView,
                        options: {
                            el: this.ordersTableBodyElement,
                            collection: this.collection
                        }
                    }
                ]);

                // Display as TreeTable
                this.$el.treeTable();
            }
        });
    }
);