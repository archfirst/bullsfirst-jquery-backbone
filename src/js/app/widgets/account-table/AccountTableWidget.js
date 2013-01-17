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
 * app/widgets/account-table/AccountTableWidget
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/widgets/account-table/AccountTableBodyView',
        'app/widgets/account-table/AccountTotalsView',
        'framework/BaseView',
        'framework/MessageBus',
        'text!app/widgets/account-table/AccountTableTemplate.html'
    ],
    function(Message, Repository, AccountTableBodyView, AccountTotalsView, BaseView, MessageBus, AccountTableTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',
            className: 'account-table-clipped-wrapper',
            elements: ['accountTableBody', 'accountTotals'],

            template: {
                name: 'AccountTableTemplate',
                source: AccountTableTemplate
            },

            events: {
                'click .account-detail-table': 'transitionToParentView'
            },

            initialize: function() {
                // Subscribe to events
                MessageBus.on(Message.AccountClick, function() {
                    // TODO: can we avoid the hardcoded pixel value below?
                    this.$el.find('.account-table-transitioning-view').animate({ left: '-615px' });
                }, this);
            },

            postRender: function() {
                this.addWidgets([
                    {
                        name: 'AccountTableBodyView',
                        widget: AccountTableBodyView,
                        element: this.accountTableBodyElement,
                        collection: Repository.getBrokerageAccounts()
                    },
                    {
                        name: 'AccountTotalsView',
                        widget: AccountTotalsView,
                        element: this.accountTotalsElement,
                        collection: Repository.getBrokerageAccounts()
                    }
                ]);
            },

            transitionToParentView: function() {
                this.$el.find('.account-table-transitioning-view').animate({ left: '0px' });
            }
        });
    }
);