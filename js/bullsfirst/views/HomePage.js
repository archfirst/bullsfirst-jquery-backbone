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
 * bullsfirst/views/HomePage
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/framework/MessageBus',
        'bullsfirst/framework/Page'],
       function(MessageBus, Page) {
    return Page.extend({
        el: '#home-page',

        events: {
            'click #login-button': 'login',
            'click #open-account-link': 'openAccount'
        },

        login: function() {
            MessageBus.trigger('UserLoggedInEvent');
            return false;
        },

        openAccount: function() {
            alert('Open Account');
            return false;
        }
    });
});