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
define(['bullsfirst/framework/MessageBus',
        'bullsfirst/views/AccountView'],
       function(MessageBus, AccountView) {

    return Backbone.View.extend({

        el: '#account-table tbody',

        // map of accountId to AccountView
        childViews: {},

        initialize: function(options) {
            this.collection.bind('reset', this.render, this);

            // Subscribe to events
            MessageBus.on('AccountList:mouseover', this.handleMouseOver, this);
            MessageBus.on('AccountList:mouseout', this.handleMouseOut, this);
            MessageBus.on('AccountList:click', this.handleClick, this);
        },

        handleMouseOver: function(accountId) {
            this.childViews[accountId].handleMouseOver();
        },

        handleMouseOut: function(accountId) {
            this.childViews[accountId].handleMouseOut();
        },

        handleClick: function(accountId) {
            this.childViews[accountId].handleClick();
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