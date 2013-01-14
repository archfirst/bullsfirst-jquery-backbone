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
 * app/pages/home/HomePage
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/widgets/footer/FooterWidget',
        'app/widgets/intro/IntroWidget',
        'app/widgets/login/LoginWidget',
        'backbone',
        'framework/BaseView',
        'framework/MessageBus',
        'text!app/pages/home/HomePageTemplate.html'
    ],
    function(Message, FooterWidget, IntroWidget, LoginWidget, Backbone, BaseView, MessageBus, HomePageTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            id: 'home-page',
            className: 'clearfix',

            template: {
                name: 'HomePageTemplate',
                source: HomePageTemplate
            },

            initialize: function() {
                var homePage = this;

                // Remove this view on a `pageChange` event
                homePage.listenTo(MessageBus, Message.PageChange, function() {
                    homePage.removeAllChildren();
                    homePage.remove();
                });
            },

            postRender: function() {
                this.addWidgets([
                    {
                        name: 'LoginWidget',
                        widget: LoginWidget,
                        element: this.$el
                    },
                    {
                        name: 'IntroWidget',
                        widget: IntroWidget,
                        element: this.$el
                    },
                    {
                        name: 'FooterWidget',
                        widget: FooterWidget,
                        element: this.$el
                    }
                ]);
            }
        });
    }
);