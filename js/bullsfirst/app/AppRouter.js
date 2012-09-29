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
define(['bullsfirst/framework/MessageBus',
        'bullsfirst/views/HomePage',
        'bullsfirst/views/UserPage'],
       function(MessageBus, HomePage, UserPage) {
    return Backbone.Router.extend({

        pages: {},

        routes: {
            '': 'showHomePage',
            'user': 'showUserPage'
        },

        initialize: function() {
            this.pages = {
                'home': new HomePage(),
                'user': new UserPage()
            };

            // Subscribe to events
            MessageBus.on('UserLoggedInEvent', function() {
                this.navigate('user', {trigger: true});
            }, this);
            MessageBus.on('UserLoggedOutEvent', function() {
                // Do a full page refresh to start from scratch
                this.navigate('');
                window.location.reload();
            }, this);
        },

        showHomePage: function() {
            this.showPage(this.pages['home']);
        },

        showUserPage: function(tab) {
            this.showPage(this.pages['user']);
        },

        showPage: function(page) {
            // if page is already visible, do nothing
            if (page.isVisible()) return;

            // else hide all pages and show the desired one
            $.when(this.hideAllPages()).then(
                function() { return page.show(); });
        },

        // Calls page.hide() on each page and returns promises that are not null
        hideAllPages: function() {
            return _.filter(
                _.map(this.pages, function(page) { return page.hide(); }),
                function (promise) { return promise != null });
        }
    });
});