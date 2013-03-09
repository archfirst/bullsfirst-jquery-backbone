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
 * app/widgets/trade/TradeSummaryWidget
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/ExternalAccount',
        'app/domain/Repository',
        'app/widgets/modal/ModalWidget',
        'framework/AlertUtil',
        'framework/ErrorUtil',
        'framework/MessageBus',
        'text!app/widgets/add-external-account/AddExternalAccountTemplate.html',
        'underscore',
        'form2js',
        'jqueryToObject',
        'jqueryValidationEngineRules'
    ],
    function(Message, ExternalAccount, Repository, ModalWidget, AlertUtil, ErrorUtil, MessageBus, AddExternalAccountTemplate, _) {
        'use strict';

        return ModalWidget.extend({
            id: 'trade-summary',
            className: 'modal modal-level2',

            template: {
                name: 'AddExternalAccountTemplate',
                source: AddExternalAccountTemplate
            },

            events: (function() {
                // Clone the prototype's events object, then extend it
                // TODO: figure out a better way to do this without instantiating a new object
                return _.extend(_.clone(new ModalWidget().events), {
                    'click #add_external_account_button': 'validateForm',
                    'keypress #add_account_dialog': 'checkEnterKey'
                });
            }()),

            initialize: function() {
                this.settings = {
                    overlay: true,
                    centerInWindow: true
                };

                return this;

            },

            checkEnterKey: function(event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    this.validateForm();
                    return false;
                }
            },

            validateForm: function() {
                if ($('#add-external-account-form').validationEngine('validate')) {

                    // Create external account
                    var externalAccount = new ExternalAccount($('#add-external-account-form').toObject());
                    Repository.getExternalAccounts().add(externalAccount);
                    externalAccount.save(null, {
                        success: this.createExternalAccountDone,
                        error: ErrorUtil.showBackboneError
                    });
                    this.closeModal();
                }
            },

            createExternalAccountDone: function(/*data, textStatus, jqXHR*/) {
                AlertUtil.showConfirmation('External Account Added');
                Repository.updateAccounts();
            },

            postPlace: function(){
                ModalWidget.prototype.postPlace.call(this);

                this.$el.find('form').validationEngine();

                return this;
            }

        });
    }
);