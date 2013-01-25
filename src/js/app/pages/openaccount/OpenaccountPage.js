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
 * app/pages/openaccount/OpenaccountPage
 *
 * @author Kanakaraj Venkataswamy
 */
define(
    [
        'app/widgets/footer/FooterWidget',
        'app/widgets/open-account-form/OpenAccountFormWidget',
        'app/widgets/open-account-intro/OpenAccountIntroWidget',
        'framework/BaseView',
        'text!app/pages/openaccount/OpenaccountPageTemplate.html'
    ],
    function(FooterWidget, OpenAccountFormWidget, OpenAccountIntroWidget, BaseView, OpenaccountPageTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            id: 'open-account-page',
            className: 'clearfix',

            template: {
                name: 'OpenaccountPageTemplate',
                source: OpenaccountPageTemplate
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'OpenAccountIntroWidget',
                        viewClass: OpenAccountIntroWidget,
                        parentElement: this.$el
                    },
                    {
                        id: 'OpenAccountFormWidget',
                        viewClass: OpenAccountFormWidget,
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