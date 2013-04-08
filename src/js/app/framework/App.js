/**
 * Copyright 2013 Archfirst
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
 * app/framework/App
 *
 * Based on: https://github.com/bobholt/backbone-arch-demo/blob/master/src/app/app.js
 * License:  https://github.com/bobholt/backbone-arch-demo/blob/master/LICENSE.md
 *
 * Starts the application in an orderly way. Responsible for creating the router
 * and managing URL navigation.
 *
 * @author Naresh Bhatia
 */
/*jshint nonew:false */
define(
    [
        'app/common/AppConfig',
        'app/framework/BackboneSyncOverride',
        'app/framework/AppRouter',
        'backbone',
        'jquery'
    ],
    function(AppConfig, BackboneSyncOverride, Router, Backbone, $) {
        'use strict';

        return {
            start: function start() {

                // Start your master router.
                new Router();

                // Trigger the initial route and enable HTML5 History API support
                Backbone.history.start({ pushState: true, root: AppConfig.appRoot });

                /*!
                * The following event handler modified from Backbone Boilerplate
                * Copyright Tim Branyen
                */
                // All navigation that is relative should be passed through the navigate
                // method, to be processed by the router. If the link has a `data-bypass`
                // attribute, bypass the delegation completely.
                $(document).on('click', 'a[href]:not([data-bypass])', function(e) {

                    // Get the absolute anchor href.
                    var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };

                    // Get the absolute root.
                    var root = location.protocol + '//' + location.host + AppConfig.appRoot;

                    // Ignore fake links (e.g. buttons, selectbox options)
                    if ( href.attr.charAt(0) === '#' ){
                        e.preventDefault();
                        return;
                    }

                    // Ignore fake links (e.g. buttons, selectbox options)
                    if ( href.attr.charAt(0) === '#' ){
                        e.preventDefault();
                        return;
                    }

                    // Ensure the root is part of the anchor href, meaning it's relative.
                    if (href.prop.slice(0, root.length) === root) {

                        // Stop the default event to ensure the link will not cause a page
                        // refresh.
                        e.preventDefault();

                        // `Backbone.history.navigate` is sufficient for all Routers and will
                        // trigger the correct events. The Router's internal `navigate` method
                        // calls this anyways.  The fragment is sliced from the root.
                        Backbone.history.navigate(href.attr, true);
                    }
                });
            }
        };
    }
);