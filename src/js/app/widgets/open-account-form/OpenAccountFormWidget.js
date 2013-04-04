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
        'app/domain/ExternalAccount',
        'app/domain/ExternalAccounts',
        'app/domain/Repository',
        'app/domain/User',
        'app/framework/ErrorUtil',
        'app/framework/Message',
        'app/services/AccountService',
        'app/services/BrokerageAccountService',
        'app/services/UserService',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/open-account-form/OpenAccountFormTemplate.html',
        'underscore',
        'form2js',
        'jqueryToObject',
        'jqueryValidationEngineRules'
    ],
    function (
        Credentials,
        ExternalAccount,
        ExternalAccounts,
        Repository,
        User,
        ErrorUtil,
        Message,
        AccountService,
        BrokerageAccountService,
        UserService,
        Backbone,
        BaseView,
        MessageBus,
        OpenAccountFormTemplate,
        _
    ) {
        'use strict';

        return BaseView.extend({

            brokerageAccountId: 0,

            externalAccountId: 0,

            tagName: 'section',
            className: 'open-account-section',
            elements: ['openAccountForm'],

            template: {
                name: 'OpenAccountFormTemplate',
                source: OpenAccountFormTemplate
            },

            events: {
                'click #open-account-button': 'handleOpenAccountButton',
                'click #oa-cancel-button': 'handleCancelButton',
                'keypress #open-account-form': 'checkEnterKey'
            },

            checkEnterKey: function checkEnterKey(event) {

                if (event.keyCode === $.ui.keyCode.ENTER) {
                    event.preventDefault();
                    this.handleOpenAccountButton();
                }
            },

            createUser: function createUser() {

                UserService.createUser(
                    this.form2CreateUserRequest(), _.bind(this.createUserDone, this),
                    ErrorUtil.showError
                );

            },

            createUserDone: function createUserDone(/* data, textStatus, jqXHR */) {

                // Add user to Repository
                Repository.initUser(this.form2User());
                Repository.initCredentials(this.form2Credentials());

                // Create brokerage account
                BrokerageAccountService.createBrokerageAccount(
                  'Brokerage Account 1', _.bind(this.createBrokerageAccountDone, this), ErrorUtil.showError);

            },

            createBrokerageAccountDone: function(data /*, textStatus, jqXHR */){
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

            createExternalAccountDone: function(model /*, jqXHR */){
                this.externalAccountId = model.id;

                // Transfer cash
                AccountService.transferCash(
                    this.externalAccountId,
                    { amount: {amount: 100000, currency: 'USD'}, toAccountId: this.brokerageAccountId },
                    _.bind(this.transferCashDone, this),
                    ErrorUtil.showError
                );
            },

            transferCashDone: function(/* data, textStatus, jqXHR */){
                Backbone.history.navigate('accounts', true);
                MessageBus.trigger(Message.UserLoggedInEvent);
            },

            handleCancelButton: function(){
                this.openAccountFormElement.validationEngine('hide');
            },

            // ------------------------------------------------------------
            // Helper functions
            // ------------------------------------------------------------
            // Creates a CreateUserRequest from the Open Account form
            form2CreateUserRequest: function(){
                var formObject = this.openAccountFormElement.toObject();
                delete formObject.confirmPassword; // property not expected by REST service
                return formObject;
            },

            // Creates a User from the Open Account form
            form2User: function(){
                var formObject = this.openAccountFormElement.toObject();
                delete formObject.password;
                delete formObject.confirmPassword;
                return formObject;
            },

            // Creates Credentials from the Open Account form
            form2Credentials: function(){
                return new Credentials(
                    $('#oa-username').val(),
                    $('#oa-password').val()
                );
            },

            handleOpenAccountButton: function handleOpenAccountButton() {

                if (this.openAccountFormElement.validationEngine('validate')) {

                    this.createUser();

                }

                return false;
            },

            postPlace: function postPlace() {

                this.openAccountFormElement.validationEngine();

            }

        });
    }
);