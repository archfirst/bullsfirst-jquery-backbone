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
 * bullsfirst/views/AccountTableWrapperView
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone',
        'app/domain/UserContext',
        'app/common/Message',
        'framework/MessageBus',
        'bullsfirst/views/AccountTableView',
        'bullsfirst/views/AccountTotalsView'
    ],
    function(Backbone, UserContext, Message, MessageBus, AccountTableView, AccountTotalsView) {
        'use strict';

        return Backbone.View.extend({

            accountTableView: null,
            accountTotalsView: null,

            events: {
                'click #account-detail-table': 'transitionToParentView'
            },

            initialize: function() {
                this.accountTableView =
                    new AccountTableView({el: '#account-table tbody', collection: UserContext.getBrokerageAccounts()});
                this.accountTotalsView =
                    new AccountTotalsView({el: '#account-table tfoot', collection: UserContext.getBrokerageAccounts()});

                // Subscribe to events
                MessageBus.on(Message.AccountClick, function() {
                    // TODO: can we avoid the hardcoded pixel value below?
                    this.$el.find('.account-table-transitioning-view').animate({ left: '-615px' });
                }, this);
            },

            transitionToParentView: function() {
                this.$el.find('.account-table-transitioning-view').animate({ left: '0px' });
            }
        });
    }
);