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

// Configure RequireJS
require.config({
    // Initialize the application with the main application file
    deps: ['main'],

    paths: {
        // jQuery
        jquery:                      'vendor/jquery-1.8.3',
        jqueryui:                    'vendor/jquery-ui-1.8.23.custom.min',
        jqueryValidationEngine:      'vendor/jquery.validationEngine-2.5.2',
        jqueryValidationEngineRules: 'vendor/jquery.validationEngine-en-2.5.2',
        jqueryTreeTable:             'vendor/jquery.treeTable-20121109',

        // Underscore
        underscore:                  'vendor/underscore-1.4.3',

        // Backbone
        backbone:                    'vendor/backbone-0.9.9',

        // Templating
        handlebars:                  'vendor/handlebars-1.0.rc.1',

        // Base64 encoding for authentication headers
        base64encode:                'vendor/base64_encode',
        utf8encode:                  'vendor/utf8_encode',

        // Formatting and parsing of dates and numbers,
        // similar to SimpleDateFormat and NumberFormat APIs
        jqueryformat:                'vendor/jquery.format-1.2',

        // Date library
        moment:                      'vendor/moment-1.7.2',

        // jQuery Alerts (http://www.codeproject.com/Articles/295236/jQuery-UI-Alerts-Dialog-using-ThemeRollers)
        jqueryalerts:                'vendor/jquery.alerts',

        // Charting
        highcharts:                  'vendor/highcharts-2.3.3'
    },

    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },

        base64encode: {
            deps: ['utf8encode'],
            exports: 'base64_encode'
        },

        handlebars: {
            exports: 'Handlebars'
        },

        highcharts: {
            exports: 'Highcharts'
        },

        jqueryalerts: {
            deps: ['jqueryui']
        },

        jqueryformat: {
            deps: ['jquery']
        },

        jqueryTreeTable: {
            deps: ['jquery']
        },

        jqueryui: {
            deps: ['jquery']
        },

        jqueryValidationEngine: {
            deps: ['jquery']
        },

        jqueryValidationEngineRules: {
            deps: ['jqueryValidationEngine']
        },

        moment: {
            exports: 'moment'
        },

        underscore: {
            exports: '_'
        }
    }
});

// Kick off the application by requiring in the app and starting it
require(
    [
        'framework/app',
        'jquery'
    ],
    function(app, $) {
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

        app.start();
    }
);