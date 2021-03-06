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
 * app/widgets/open-account-form/CreateUserViewModel
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone',
        'validation'
    ],
    function(Backbone) {
        'use strict';

        return Backbone.Model.extend({

            validation: {
                firstName: [{
                    required: true
                }, {
                    pattern: 'lettersOnly',
                    msg: 'First name can contain letters only'
                }],
                lastName: [{
                    required: true
                }, {
                    pattern: 'lettersOnly',
                    msg: 'Last name can contain letters only'
                }],
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                confirmPassword: {
                    required: true,
                    equalTo: 'password'
                }
            }

        });
    }
);