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
 * bullsfirst/domain/Order
 *
 * Attributes:
 *   id: int
 *   creationTime: Date
 *   side: Side
 *   symbol: String
 *   quantity: int
 *   cumQty: int
 *   orderType: OrderType
 *   limitPrice: Money
 *   term: Term
 *   allOrNone: boolean
 *   orderStatus: OrderStatus
 *   accountId: int
 *   accountName: String
 *   executions: [Execution]
 *
 * @author Naresh Bhatia
 */
define(function() {

    return Backbone.Model.extend({

        // Initialize calculated fields
        // We are intentionally not parsing executions into a backbone collection,
        // just to show that it is possible to use the executions array as is.
        parse: function(response) {
            response.executionPrice = this.calculateExecutionPrice(response);
            response.isActive =
                response.status == 'New' ||
                response.status == 'PartiallyFilled' ||
                response.status == 'PendingNew';
            return response;
        },

        calculateExecutionPrice: function(response) {
            if (typeof response.executions === 'undefined' || response.executions.length == 0)
                return null;

            var totalPrice = 0;
            var totalQuantity = 0;
            response.executions.forEach(function(execution) {
                totalPrice += execution.price.amount * execution.quantity;
                totalQuantity += execution.quantity;
            });
            var executionPrice = {
                amount: totalPrice / totalQuantity,
                currency: 'USD'
            }
            return executionPrice;
        }
    });
});