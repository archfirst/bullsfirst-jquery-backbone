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
 * app/widgets/open-account-form/OpenAccountFormWidget
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/ExternalAccount',
        'app/domain/Repository',
        'app/framework/ErrorUtil',
        'app/framework/Message',
        'app/services/AccountService',
        'app/services/BrokerageAccountService',
        'app/services/UserService',
        'app/widgets/open-account-form/CreateUserViewModel',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/open-account-form/OpenAccountFormTemplate.html',
        'underscore',
        'stickit',
        'validation'
    ],
    function (
        ExternalAccount,
        Repository,
        ErrorUtil,
        Message,
        AccountService,
        BrokerageAccountService,
        UserService,
        CreateUserViewModel,
        Backbone,
        BaseView,
        MessageBus,
        OpenAccountFormTemplate,
        _
    ) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            className: 'open-account-section',
            elements: ['openAccountForm'],

            template: {
                name: 'OpenAccountFormTemplate',
                source: OpenAccountFormTemplate
            },

            bindings: {
                '#oa-firstname': {
                    observe: 'firstName',
                    events: ['blur'],
                    setOptions: { validate: true }
                },
                '#oa-lastname': {
                    observe: 'lastName',
                    events: ['blur'],
                    setOptions: { validate: true }
                },
                '#oa-username': {
                    observe: 'username',
                    events: ['blur'],
                    setOptions: { validate: true }
                },
                '#oa-password': {
                    observe: 'password',
                    events: ['blur'],
                    setOptions: { validate: true }
                },
                '#oa-confirmPassword': {
                    observe: 'confirmPassword',
                    events: ['blur'],
                    setOptions: { validate: true }
                }
            },

            events: {
                'click #open-account-button': 'handleOpenAccountButton',
                'keypress #open-account-form': 'checkEnterKey'
            },

            initialize: function() {
                this.model = new CreateUserViewModel();
                Backbone.Validation.bind(this);
            },

            postRender: function() {
                this.stickit();
            },

            checkEnterKey: function(event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    this.handleOpenAccountButton(event);
                }
            },

            handleOpenAccountButton: function(event) {
                event.preventDefault();

                if (this.model.isValid(true)) {
                    this.createUser();
                }
            },

            createUser: function() {
                var createUserRequest = this.model.toJSON();
                delete createUserRequest.confirmPassword; // property not expected by REST service

                UserService.createUser(
                    createUserRequest, _.bind(this.createUserDone, this), ErrorUtil.showError);
            },

            createUserDone: function() {
                var createUserRequest = this.model.toJSON();

                // Initialize user information
                Repository.getUser().set({
                    firstName: createUserRequest.firstName,
                    lastName: createUserRequest.lastName,
                    username: createUserRequest.username
                });

                Repository.getCredentials().set({
                    username: createUserRequest.username,
                    password: createUserRequest.password
                });

                // Create brokerage account
                BrokerageAccountService.createBrokerageAccount(
                  'Brokerage Account 1', _.bind(this.createBrokerageAccountDone, this), ErrorUtil.showError);
            },

            createBrokerageAccountDone: function(data) {
                this.brokerageAccountId = data.id;

                // Create external account
                var externalAccount = new ExternalAccount({
                    name: 'External Account 1',
                    routingNumber: '022000248',
                    accountNumber: '12345678'
                });
                Repository.getExternalAccounts().add(externalAccount);
                externalAccount.save(null, {
                    success: _.bind(this.createExternalAccountDone, this),
                    error: ErrorUtil.showBackboneError
                });
            },

            createExternalAccountDone: function(data) {
                this.externalAccountId = data.id;

                // Transfer cash
                AccountService.transferCash(
                    this.externalAccountId,
                    { amount: {amount: 100000, currency: 'USD'}, toAccountId: this.brokerageAccountId },
                    _.bind(this.transferCashDone, this),
                    ErrorUtil.showError
                );
            },

            transferCashDone: function() {
                Backbone.history.navigate('accounts', true);
                MessageBus.trigger(Message.UserLoggedInEvent);
            }
        });
    }
);