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
 * app/services/UserService
 *
 * Proxy for User resource on the server. This module was created seperately
 * (instead of adding it to the User model), because it was difficult to
 * retrofit this functionality into Backbone's CRUD mechanism. For example,
 * the User object does not contain a password, but a password is required to
 * create the user.
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/framework/AjaxUtil',
        'app/framework/AppConfig'
    ],
    function(AjaxUtil, AppConfig) {
        'use strict';

        // Module level variables act as singletons
        var _url = AppConfig.omsApi + '/users';

        return {

            // createUserRequest: an object containing firstName, lastName, username and password
            // doneCallbacks: a function, or array of functions, called when the Deferred is resolved
            // failCallbacks: a function, or array of functions, called when the Deferred is rejected
            createUser: function(createUserRequest, doneCallbacks, failCallbacks) {
                $.ajax({
                    url: _url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(createUserRequest, null, '\t')
                })
                .then(doneCallbacks, failCallbacks);
            },

            // credentials: credentials to use for getting the user
            // doneCallbacks: a function, or array of functions, called when the Deferred is resolved
            // failCallbacks: a function, or array of functions, called when the Deferred is rejected
            getUser: function(credentials, doneCallbacks, failCallbacks) {
                $.ajax({
                    url: _url + '/' + credentials.get('username'),
                    beforeSend: function(xhr) {
                        AjaxUtil.setPasswordHeader(xhr, credentials.get('password'));
                    }
                })
                .then(doneCallbacks, failCallbacks);
            }
        };
    }
);