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
 * app/framework/BackboneSyncOverride
 *
 * Overrides Backbone.sync to send an authorization header for secure urls
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/Repository',
        'app/framework/AjaxUtil',
        'backbone',
        'underscore'
    ],
    function(Repository, AjaxUtil, Backbone, _) {
        'use strict';

        Backbone._sync = Backbone.sync;

        Backbone.sync = function(method, model, options) {
            var url = options.url || getValue(model, 'url');
            if (url && (url.indexOf('/secure/') > 0)) {
                options.beforeSend = function(xhr) {
                    AjaxUtil.setAuthorizationHeader(xhr, Repository.getCredentials());
                };
            }
            Backbone._sync(method, model, options);
        };

        // Helper function to get a value from a Backbone object as a property
        // or as a function.
        var getValue = function(object, prop) {
            if (!(object && object[prop])) { return null; }
            return _.isFunction(object[prop]) ? object[prop]() : object[prop];
        };
    }
);