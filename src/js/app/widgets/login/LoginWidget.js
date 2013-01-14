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
 * app/widgets/login/LoginWidget
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/domain/Credentials',
        'app/domain/UserContext',
        'backbone',
        'framework/ErrorUtil',
        'framework/MessageBus',
        'app/services/UserService',
        'framework/BaseView',
        'text!app/widgets/login/LoginTemplate.html',
        'underscore',
        'jqueryui',
        'jqueryValidationEngineRules'
    ],
    function(Message, Credentials, UserContext, Backbone, ErrorUtil, MessageBus, UserService, BaseView, LoginTemplate, _) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            className: 'login-section',
            elements: ['loginForm', 'username', 'password'],

            template: {
                name: 'LoginTemplate',
                source: LoginTemplate
            },

            events: {
                'click .login-button': 'login',
                'keypress .login-form': 'checkEnterKey'
            },

            postPlace: function() {
                this.loginFormElement.validationEngine();
            },

            checkEnterKey: function(event) {
               if (event.keyCode === $.ui.keyCode.ENTER) {
                   this.login();
                   return false;
               }
            },

            login: function() {
                if (this.loginFormElement.validationEngine('validate')) {
                    UserService.getUser(
                        this.form2Credentials(), _.bind(this.loginDone, this), ErrorUtil.showError);
                }
                return false;
            },

            loginDone: function(data /* , textStatus, jqXHR */) {
                // Add user to UserContext
                UserContext.initUser(data);
                UserContext.initCredentials(this.form2Credentials());

                // Navigate to accounts and fire UserLoggedInEvent
                Backbone.history.navigate('accounts', true);
                MessageBus.trigger(Message.UserLoggedInEvent);
            },

            // ------------------------------------------------------------
            // Helper functions
            // ------------------------------------------------------------
            // Creates Credentials from the Login form
            form2Credentials: function() {
                return new Credentials(
                    this.usernameElement.val(),
                    this.passwordElement.val());
            }
        });
    }
);