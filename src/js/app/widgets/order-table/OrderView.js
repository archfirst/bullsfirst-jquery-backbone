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
 * app/widgets/order-table/OrderView
 *
 * @author Sreejesh Karunakaran
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/services/OrderService',
        'framework/BaseView',
        'framework/ErrorUtil',
        'framework/MessageBus',
        'text!app/widgets/order-table/OrderTemplate.html',
        'underscore'
    ],
    function(Message, Repository, OrderService, BaseView, ErrorUtil, MessageBus, OrderTemplate, _) {
        'use strict';

        return BaseView.extend({

            tagName: 'tr',

            events: {
                'click .order_cancel': 'cancelOrder'
            },

            template: {
                name: 'OrderTemplate',
                source: OrderTemplate
            },

            cancelOrder: function() {
                OrderService.cancelOrder( this.model.id, _.bind(this.cancelOrderDone, this), ErrorUtil.showError);
                return false;
            },
            cancelOrderDone: function() {
                MessageBus.trigger( Message.UpdateOrders );
            }
        });
    }
);