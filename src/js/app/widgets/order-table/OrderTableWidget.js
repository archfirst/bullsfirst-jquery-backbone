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
 * app/widgets/order-table/OrderTableWidget
 *
 * @author Sreejesh Karunakaran
 */
define(
    [
        'app/domain/Orders',
        'app/domain/Repository',
        'app/framework/Message',
        'app/widgets/order-table/OrderTableView',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/order-table/OrderTableTemplate.html',
        'jqueryTreeTable'
    ],
    function(Orders, Repository, Message, OrderTableView, BaseView, MessageBus, OrderTableTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'table',
            className: 'orders-table bf-table',
            elements: ['ordersTableBody'],

            template: {
                name: 'OrderTableTemplate',
                source: OrderTableTemplate
            },

            initialize: function() {
                this.collection = Repository.getOrders();
                this.collection.bind('reset', this.render, this);
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'OrderTableView',
                        viewClass: OrderTableView,
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