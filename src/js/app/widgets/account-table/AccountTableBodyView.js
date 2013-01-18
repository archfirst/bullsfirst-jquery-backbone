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
 * app/widgets/account-table/AccountTableBodyView
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/widgets/account-table/AccountView',
        'framework/BaseView',
        'framework/MessageBus',
        'underscore'
    ],
    function(Message, AccountView, BaseView, MessageBus, _) {
        'use strict';

        return BaseView.extend({
            editMode: false,

            initialize: function() {
                this.listenTo(this.collection, 'reset', this.handleReset);

                // Subscribe to events
                MessageBus.on(Message.AccountMouseOverRaw, this.handleMouseOverRaw, this);
                MessageBus.on(Message.AccountMouseOutRaw, this.handleMouseOutRaw, this);
                MessageBus.on(Message.AccountClickRaw, this.handleClickRaw, this);
                MessageBus.on(Message.AccountClickEditIconRaw, this.handleClickEditIconRaw, this);
                MessageBus.on(Message.AccountStoppedEditing, function() { this.editMode = false; }, this);
            },

            handleReset: function() {
                this.render();
            },

            handleMouseOverRaw: function(accountId) {
                if (!this.editMode) {
                    this.children[accountId].handleMouseOver();
                    MessageBus.trigger(Message.AccountMouseOver, accountId);
                }
            },

            handleMouseOutRaw: function(accountId) {
                if (!this.editMode) {
                    this.children[accountId].handleMouseOut();
                    MessageBus.trigger(Message.AccountMouseOut, accountId);
                }
            },

            handleClickRaw: function(accountId) {
                if (!this.editMode) {
                    MessageBus.trigger(Message.AccountClick, accountId);
                }
            },

            handleClickEditIconRaw: function(accountId) {
                if (!this.editMode) {
                    this.editMode = true;
                    this.children[accountId].handleClickEditIcon();
                }
            },

            render: function() {
                this.destroyChildren();

                // Sort accounts by descending market value
                var accounts = this.collection.sortBy(function(account) {
                    return -(account.get('marketValue').amount);
                }) ;

                // Create new views for each account
                _.each(accounts, function(account, i) {
                    this.renderAccount(account, i);
                }, this);

                return this;
            },

            renderAccount: function(account, index) {
                var view = this.addChild({
                    id: account.id,
                    viewClass: AccountView,
                    parentElement: this.$el,
                    options: {
                        model: account
                    }
                });
                view.$el.find('.legend').addClass('legend-' + (index%10) + '-gradient');
            }
        });
    }
);