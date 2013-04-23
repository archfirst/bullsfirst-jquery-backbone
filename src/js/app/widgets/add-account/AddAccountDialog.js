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
 * app/widgets/add-account/AddAccountDialog
 *
 * Allows user to add a brokerage account.
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/Repository',
        'app/framework/ErrorUtil',
        'app/framework/ModalDialog',
        'app/services/BrokerageAccountService',
        'text!app/widgets/add-account/AddAccountTemplate.html',
        'jqueryValidationEngineRules'
    ],
    function(Repository, ErrorUtil, ModalDialog, BrokerageAccountService, AddAccountTemplate) {
        'use strict';

        return ModalDialog.extend({
            id: 'add-account-dialog',
            className: 'modal theme-b',

            template: {
                name: 'AddAccountTemplate',
                source: AddAccountTemplate
            },

            events: {
                'click .add-account-button': 'validateForm',
                'click .close-button': 'close',
                'keypress #add-account-dialog': 'checkEnterKey'
            },

            initialize: function() {
                this.settings = {
                    draggable: true,
                    centerInWindow: true,
                    overlayVisible: true
                };

            },

            checkEnterKey: function(event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    this.validateForm();
                    return false;
                }
            },

            validateForm: function() {
                if ($('#add-account-form').validationEngine('validate')) {

                    // Create brokerage account
                    BrokerageAccountService.createBrokerageAccount(
                        $('#add-account-name').val(), this.createBrokerageAccountDone, ErrorUtil.showError);

                    this.close();
                }
            },

            createBrokerageAccountDone: function(/*data, textStatus, jqXHR*/) {
                Repository.updateAccounts();
            },

            postPlace: function(){
                ModalDialog.prototype.postPlace.call(this);
                this.$el.find('form').validationEngine();
                return this;
            }
        });
    }
);