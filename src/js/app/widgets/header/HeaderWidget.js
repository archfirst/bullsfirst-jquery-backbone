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
 * app/widgets/header/HeaderWidget
 *
 * This is the header widget for the user page.
 *
 * @author Naresh Bhatia
 */
define(
    [
        'framework/BaseView',
        'text!app/widgets/header/HeaderTemplate.html'
    ],
    function(BaseView, HeaderTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'header',
            className: 'user-page-header',

            template: {
                name: 'HeaderTemplate',
                source: HeaderTemplate
            }
        });
    }
);