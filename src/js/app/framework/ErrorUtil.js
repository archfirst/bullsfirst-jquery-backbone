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
 * app/framework/ErrorUtil
 *
 * Utility functions for error handling
 *
 * @author Naresh Bhatia
 */
define(['app/framework/AlertUtil'],
       function(AlertUtil) {
    'use strict';

    return {
        showError: function(jqXHR /*, textStatus, errorThrown */) {
            if (jqXHR.getResponseHeader('Content-Type') === 'application/json') {
                AlertUtil.showError(JSON.parse(jqXHR.responseText).detail);
            }
            else {
                AlertUtil.showError(jqXHR.status + ' - ' + jqXHR.statusText);
            }
        },

        // Note that Backbone sends different parameters to callbacks
        showBackboneError: function(model, jqXHR) {
            if (jqXHR.getResponseHeader('Content-Type') === 'application/json') {
                AlertUtil.showError(JSON.parse(jqXHR.responseText).detail);
            }
            else {
                AlertUtil.showError(jqXHR.status + ' - ' + jqXHR.statusText);
            }
        }
    };
});