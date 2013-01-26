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
        'text!app/widgets/order-filter/OrdersFilterTemplate.html',
        'jqueryselectbox'
    ],
    function(Message, Repository, FilterWidget, Backbone, BaseView, MessageBus, OrdersFilterTemplate) {
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