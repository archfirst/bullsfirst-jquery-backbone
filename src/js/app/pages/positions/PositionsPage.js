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
 * app/pages/positions/PositionsPage
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/pages/positions/PositionsTab',
        'app/widgets/footer/FooterWidget',
        'app/widgets/user-page-header/UserPageHeaderWidget',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/pages/positions/PositionsPageTemplate.html'
    ],
    function(Message, Repository, PositionsTab, FooterWidget, UserPageHeaderWidget, BaseView, MessageBus, PositionsPageTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            id: 'positions-page',
            className: 'clearfix',

            template: {
                name: 'PositionsPageTemplate',
                source: PositionsPageTemplate
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'UserPageHeaderWidget',
                        viewClass: UserPageHeaderWidget,
                        parentElement: this.$el,
                        options: {
                            model: Repository.getUser()
                        }
                    },
                    {
                        id: 'PositionsTab',
                        viewClass: PositionsTab,
                        parentElement: this.$el
                    },
                    {
                        id: 'FooterWidget',
                        viewClass: FooterWidget,
                        parentElement: this.$el
                    }
                ]);
            }
        });
    }
);