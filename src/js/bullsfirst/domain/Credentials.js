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
 * bullsfirst/domain/Credentials
 *
 * This is a normal JavaScript class with a constructor.
 * (No need to make it a backbone model)
 *
 * Attributes:
 *   username: String
 *   password: String
 *
 * @author Naresh Bhatia
 */
define(function() {
    'use strict';

    function Credentials(username, password) {
        this.username = username;
        this.password = password;
    }

    Credentials.prototype.set = function(attributes) {
        this.username = attributes.username;
        this.password = attributes.password;
    };

    Credentials.prototype.clear = function() {
        this.username = undefined;
        this.password = undefined;
    };

    Credentials.prototype.isInitialized = function() {
        return (typeof this.username !== 'undefined' && typeof this.password !== 'undefined');
    };

    return Credentials;
});