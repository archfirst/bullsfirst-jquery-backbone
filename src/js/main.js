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
        'app/framework/App',
        'jquery',
        'app/framework/HandlebarsUtil',
        'app/framework/StickitUtil',
        'app/framework/ValidationUtil'
    ],
    function(App, $) {
        'use strict';

        // Load Crockford's JSON library if browser does not have native support
        $(document).ready(function() {
            Modernizr.load({
                test: window.JSON,
                nope: 'js/vendor/json2.js'
            });
        });

        // Kick off the application by requiring in the app and starting it
        App.start();
    }
);