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
        'app/widgets/order-table/ExecutionView',
        'app/widgets/order-table/OrderView',
        'keel/BaseView'
    ],
    function(ExecutionView, OrderView, BaseView) {
        'use strict';

        return BaseView.extend({

            render: function() {
                this.destroyChildren();

                this.collection.each(function(order) {
                    var orderId = 'order-' + order.get('id');
                    this.addChild({
                        id: orderId,
                        viewClass: OrderView,
                        parentElement: this.$el,
                        options: {
                            model: order,
                            id: orderId,
                            className: (order.get('status') === 'Canceled') ? 'canceled' : ''
                        }
                    });

                    // Add rows for executions
                    var executions = order.get('executions');
                    if (executions && executions.length > 0) {
                        this._renderExecutions(executions, orderId);
                    }
                }, this);

                return this;
            },

            _renderExecutions: function(executions, orderId) {
                executions.forEach(function(execution) {
                    var id = 'execution-' + execution.id;
                    this.addChild({
                        id: id,
                        viewClass: ExecutionView,
                        parentElement: this.$el,
                        options: {
                            model: execution,
                            id: id,
                            className: 'child-of-' + orderId
                        }
                    });
                }, this);
            }
        });
    }
);