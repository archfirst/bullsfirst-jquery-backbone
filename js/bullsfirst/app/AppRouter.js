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
 * bullsfirst/app/AppRouter
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/domain/UserContext',
        'bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/views/HomePage',
        'bullsfirst/views/UserPage'],
       function(UserContext, Message, MessageBus, HomePage, UserPage) {
    'use strict';

    return Backbone.Router.extend({

        pages: {},

        routes: {
            '': 'showHomePage',
            'user/:tab': 'showUserPage'
        },

        // Tab displayed on user login (can change when user enters a bookmarked URL)
        startTab: 'accounts',

        initialize: function() {
            this.pages = {
                'home': new HomePage(),
                'user': new UserPage()
            };

            // Subscribe to events
            MessageBus.on(Message.UserLoggedInEvent, function() {
                MessageBus.trigger(
                    Message.TabSelectionRequest,
                    { tabbar: 'user', tab: this.startTab + '-tab' });
            }, this);
            MessageBus.on(Message.UserLoggedOutEvent, function() {
                // Do a full page refresh to start from scratch
                this.navigate('');
                window.location.reload();
            }, this);
            MessageBus.on(Message.TabSelectionRequest, function(tabInfo) {
                var tabName = tabInfo.tab.replace('-tab', ''); // strip -tab at the end
                this.navigate(tabInfo.tabbar + '/' + tabName, {trigger: true});
            }, this);
        },

        showHomePage: function() {
            this.showPage(this.pages.home);
        },

        showUserPage: function(tab) {
            // Show user page only if user is logged in
            if (UserContext.isUserLoggedIn()) {
                this.showPage(this.pages.user);
                this.pages.user.selectTab(tab + '-tab');
            }
            else {
                // happens when user enters a bookmarked URL
                this.startTab = tab;
                this.navigate('');
                this.showPage(this.pages.home);
            }
        },

        showPage: function(page) {
            // if page is already visible, do nothing
            if (page.isVisible()) { return; }

            // else hide all pages and show the desired one
            $.when(this.hideAllPages()).then(
                function() { return page.show(); });
        },

        // Calls page.hide() on each page and returns promises that are not null
        hideAllPages: function() {
            return _.filter(
                _.map(this.pages, function(page) { return page.hide(); }),
                function(promise) { return promise !== null; });
        }
    });
});