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
 * framework/Router
 *
 * Based on: https://github.com/bobholt/backbone-arch-demo/blob/master/src/framework/Router.js
 * License:  https://github.com/bobholt/backbone-arch-demo/blob/master/LICENSE.md
 *
 * Extends Backbone.Router to route to different pages in the application.
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'backbone',
        'framework/MessageBus'
    ],
    function(Message, Backbone, MessageBus) {
        'use strict';

        return Backbone.Router.extend({

            // Route map
            routes: {
                '':       'goToPage',
                ':page':  'goToPage'
            },

            // Simply directs the application to go to a specific page
            goToPage: function(page) {

                // If we do not receive a page argument, just go home
                if (!page || page === 'index.html') {
                    page = 'home';
                }

                // Trigger the `pageBeforeChange` event in the MessageBus
                MessageBus.trigger(Message.PageBeforeChange, page);

                // Derive page name from route, e.g. `home` becomes `HomePage`
                var pageName = page[0].toUpperCase() + page.slice(1) + 'Page';

                // Load the page and render it
                require(['app/pages/' + page + '/' + pageName], function(PageClass) {

                    var pageInstance = new PageClass().render().place('#container');

                    // Remove the page on a `pageBeforeChange` event
                    pageInstance.listenTo(MessageBus, Message.PageBeforeChange, function() {
                        pageInstance.destroy();
                    });

                    // Trigger the `pageChange` event in the MessageBus
                    MessageBus.trigger(Message.PageChange, page);
                });
            }
        });
    }
);