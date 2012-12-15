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
 * bullsfirst/views/AccountTableView
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/views/AccountView'],
       function(Message, MessageBus, AccountView) {
    'use strict';

    return Backbone.View.extend({

        el: '#account-table tbody',

        // map of accountId to AccountView
        childViews: {},

        editMode: false,

        initialize: function() {
            this.collection.on('reset', this.render, this);

            // Subscribe to events
            MessageBus.on(Message.AccountMouseOverRaw, this.handleMouseOverRaw, this);
            MessageBus.on(Message.AccountMouseOutRaw, this.handleMouseOutRaw, this);
            MessageBus.on(Message.AccountClickRaw, this.handleClickRaw, this);
            MessageBus.on(Message.AccountClickEditIconRaw, this.handleClickEditIconRaw, this);
            MessageBus.on(Message.AccountStoppedEditing, function() { this.editMode = false; }, this);
        },

        handleMouseOverRaw: function(accountId) {
            if (!this.editMode) {
                this.childViews[accountId].handleMouseOver();
                MessageBus.trigger(Message.AccountMouseOver, accountId);
            }
        },

        handleMouseOutRaw: function(accountId) {
            if (!this.editMode) {
                this.childViews[accountId].handleMouseOut();
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
                this.childViews[accountId].handleClickEditIcon();
            }
        },

        render: function() {
            // take out rows that might be sitting in the table
            this.$el.empty();
            this.childViews = {};

            // Sort accounts by descending market value
            var accounts = this.collection.sortBy(function(account) {
                return -(account.get('marketValue').amount);
            }) ;

            // Create views for each account
            _.each(accounts, function(account, i) {
                var view = new AccountView({model: account});
                view.render().$el.find('.legend').addClass('color-' + (i%10) + '-gradient');
                this.$el.append(view.el);
                this.childViews[account.id] = view;
            }, this);

            return this;
        }
    });
});