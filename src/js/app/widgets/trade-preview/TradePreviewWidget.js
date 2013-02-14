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
 * app/widgets/trade/TradeSummaryWidget
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/services/OrderService',
        'app/widgets/modal/ModalWidget',
        'framework/ErrorUtil',
        'framework/MessageBus',
        'text!app/widgets/trade-preview/TradePreviewTemplate.html',
        'underscore'
    ],
    function(Message, Repository, OrderService, ModalWidget, ErrorUtil, MessageBus, TradePreviewTemplate, _) {
        'use strict';

        return ModalWidget.extend({
            id: 'trade-summary',
            className: 'modal-wrapper summary-modal',

            template: {
                name: 'TradePreviewTemplate',
                source: TradePreviewTemplate
            },

            events: {
                'click .modal-close' : 'closeModal',
                'click .trade-submit-order' : 'submitOrder',
                'click .trade-edit-order' : 'closeModal'
            },

            initialize: function() {

                this.model.set('brokerageAccountName', Repository.getBrokerageAccount(this.model.get('brokerageAccountId')).get('name'));

                //this.listenTo(this.model, 'change', this.render);

                this.settings = {
                    id: this.id,
                    title: 'Trade Summary',
                    type: 'trade-summary',
                    overlay: true,
                    draggable: false,
                    closeButton: true,
                    position: 'center',
                    summary: this.model.toJSON()
                };

                return this;

            },

            postPlace: function(){

                this._postPlace();

                MessageBus.trigger(Message.ModalLoad);

                return this;
            },

            submitOrder: function(){

                var attr = this.model.attributes,
                    orderRequest = {
                        brokerageAccountId: attr.brokerageAccountId,
                        orderParams: attr.orderParams
                    };

                // Create brokerage account
                OrderService.createOrder( orderRequest, _.bind(this.orderComplete, this), ErrorUtil.showError);
            },

            orderComplete: function() {
                // Show the order
                MessageBus.trigger('UpdateOrders');
                MessageBus.trigger('UserTabSelectionRequest', 'orders');

                this.closeModal();
            }

        });
    }
);