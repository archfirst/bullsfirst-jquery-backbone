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
        'app/domain/Repository',
        'app/domain/Orders',
        'app/widgets/order-table/OrdersTableView',
        'framework/BaseView',
        'framework/MessageBus',
        'text!app/widgets/order-table/OrdersTableTemplate.html'
    ],
    function(Message, Repository, Orders, OrdersTableView,
        BaseView, MessageBus, OrdersTableTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',

            template: {
                name: 'OrdersTableTemplate',
                source: OrdersTableTemplate
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'OrdersTableView',
                        viewClass: OrdersTableView,
                        el: '#orders-table tbody',
                        options: {
                            el: '#orders-table tbody',
                            tab: 'orders',
                            collection: new Orders()
                        }
                    }
                   
                ]);
            }
        });
    }
);