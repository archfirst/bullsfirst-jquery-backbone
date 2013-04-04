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
        'app/domain/Credentials',
        'app/domain/Repository',
        'app/framework/Message',
        'app/services/UserService',
        'app/framework/ErrorUtil',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/login/LoginTemplate.html',
        'underscore',
        'jqueryui',
        'jqueryValidationEngineRules'
    ],
    function(Credentials, Repository, Message, UserService, ErrorUtil, Backbone, BaseView, MessageBus, LoginTemplate, _) {
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
                'click .test-login-button': 'testLogin',
                'keypress .login-form': 'checkEnterKey'
            },

            enteredCredentials: null,

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
                this.enteredCredentials = this.form2Credentials();
                if (this.loginFormElement.validationEngine('validate')) {
                    UserService.getUser(
                        this.enteredCredentials, _.bind(this.loginDone, this), ErrorUtil.showError);
                }
                return false;
            },

            testLogin: function() {
                this.enteredCredentials = this.getTestCredentials();
                UserService.getUser(
                    this.enteredCredentials, _.bind(this.loginDone, this), ErrorUtil.showError);
                return false;
            },

            loginDone: function(data /* , textStatus, jqXHR */) {
                // Add user to Repository
                Repository.initUser(data);
                Repository.initCredentials(this.enteredCredentials);

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
            },

            getTestCredentials: function() {
                return new Credentials('test', 'test');
            }
        });
    }
);