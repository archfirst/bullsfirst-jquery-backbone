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
 * bullsfirst/framework/AjaxUtil
 *
 * Utility functions for error handling
 *
 * @author Naresh Bhatia
 */
define(function() {
    'use strict';

    return {
        /**
         * Sets the password header in the request. This is needed only for the get user
         * REST request.
         */
        setPasswordHeader: function(xhr, password) {
            xhr.setRequestHeader('password', password);
        },

        /**
         * Sets an Authorization header in the request. We force this header in every
         * request to avoid being challenged by the server for credentials (the server
         * sends a 401 Unauthorized error along with a WWW-Authenticate header to do this).
         * Specifically, we don't rely on username/password settings in the jQuery.ajax()
         * call since they cause an unnecessary roundtrip to the server resulting in a 401
         * before sending the Authorization header.
         */
        setAuthorizationHeader: function(xhr, credentials) {
            xhr.setRequestHeader(
                'Authorization',
                'Basic ' + base64_encode(
                    credentials.username + ':' +
                    credentials.password));
        }
    };
});