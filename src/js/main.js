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
 * Application Entry Point
 *
 * @author Naresh Bhatia
 */
require(
    [
        'app/common/HandlebarsUtil',
        'framework/App',
        'jquery'
    ],
    function(HandlebarsUtil, App, $) {
        'use strict';

        // Load Crockford's JSON library if browser does not have native support
        $(document).ready(function() {
            Modernizr.load({
                test: window.JSON,
                nope: 'js/vendor/json2.js'
            });
        });

        // Set default timeout for AJAX requests to 20 seconds
        // This should be done before instantiating the AppRouter,
        // because the initialization sequence fires AJAX requests
        $.ajaxSetup({timeout: 20000});

        // Register Handlebars helpers
        HandlebarsUtil.registerHelpers();

        // Kick off the application by requiring in the app and starting it
        App.start();
    }
);