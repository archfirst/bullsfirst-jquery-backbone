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
        'app/domain/Repository',
        'app/framework/Message',
        'app/services/UserService',
        'app/framework/ErrorUtil',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/login/LoginTemplate.html',
        'stickit',
        'validation'
    ],
    function(Repository, Message, UserService, ErrorUtil, Backbone, BaseView, MessageBus, LoginTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            className: 'login-section',
            elements: ['loginForm'],

            template: {
                name: 'LoginTemplate',
                source: LoginTemplate
            },

            bindings: {
                '#username': {
                    observe: 'username',
                    events: ['blur'],
                    setOptions: { validate: true }
                },
                '#password': {
                    observe: 'password',
                    events: ['blur'],
                    setOptions: { validate: true }
                }
            },

            events: {
                'click .login-button': 'login',
                'click .test-login-button': 'testLogin',
                'keypress .login-form': 'checkEnterKey'
            },

            initialize: function() {
                this.model = Repository.getCredentials();
                Backbone.Validation.bind(this);
            },

            postRender: function() {
                this.stickit();
            },

            checkEnterKey: function(event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    this.login();
                    return false;
                }
            },

            login: function(e) {
                e.preventDefault();

                if (this.model.isValid(true)) {
                    UserService.getUser(
                        this.model, this.loginDone, ErrorUtil.showError);
                }
            },

            testLogin: function(e) {
                this.model.set({ username: 'test', password: 'test' });
                this.login(e);
            },

            loginDone: function(data /* , textStatus, jqXHR */) {
                // Add user to Repository
                Repository.initUser(data);

                // Navigate to accounts and fire UserLoggedInEvent
                Backbone.history.navigate('accounts', true);
                MessageBus.trigger(Message.UserLoggedInEvent);
            }
        });
    }
);