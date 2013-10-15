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
 * app/widgets/trade/TradePreviewDialog
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/Repository',
        'app/framework/ErrorUtil',
        'app/framework/Formatter',
        'app/framework/Message',
        'app/framework/ModalDialog',
        'app/services/OrderService',
        'backbone',
        'keel/MessageBus',
        'text!app/widgets/trade-preview/TradePreviewTemplate.html',
        'underscore'
    ],
    function(Repository, ErrorUtil, Formatter, Message, ModalDialog, OrderService, Backbone, MessageBus, TradePreviewTemplate, _) {
        'use strict';

        return ModalDialog.extend({
            id: 'trade-preview-dialog',
            className: 'modal theme-b',

            template: {
                name: 'TradePreviewTemplate',
                source: TradePreviewTemplate
            },

            elements: ['accountName', 'estimatedValue', 'fees', 'estimatedValueInclFees'],

            events: {
                'click .close-button': 'close',
                'click .trade-edit-order': 'close',
                'click .trade-submit-order': 'submitOrder'
            },

            initialize: function() {

                this.model.brokerageAccountName =
                    Repository.getBrokerageAccount(this.model.get('brokerageAccountId')).get('name');

                this.settings = {
                    overlayVisible: true,
                    centerInWindow: true
                };

                return this;

            },

            postRender: function() {
                // Call the base class postRender first
                ModalDialog.prototype.postRender.apply(this, arguments);

                // Fill the fields not available in the model
                var accountName =
                    Repository.getBrokerageAccount(this.model.get('brokerageAccountId')).get('name');
                this.accountNameElement.html(accountName);

                var estimate = this.options.estimate;
                this.estimatedValueElement.html( Formatter.formatMoney(estimate.estimatedValue) );
                this.feesElement.html( Formatter.formatMoney(estimate.fees) );
                this.estimatedValueInclFeesElement.html( Formatter.formatMoney(estimate.estimatedValueInclFees) );
            },

            submitOrder: function() {
                OrderService.createOrder(this.model, _.bind(this.orderSubmissionSuccessful, this), ErrorUtil.showError);
            },

            orderSubmissionSuccessful: function() {
                MessageBus.trigger('OrderSubmissionSuccessful');
                Backbone.history.navigate('orders', true);
                this.close();
            }
        });
    }
);