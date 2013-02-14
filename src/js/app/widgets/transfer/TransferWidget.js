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
 * bullsfirst/views/TransferView
 *
 * @author Vikas Goyal
 */
/* jslint flags */
/*global $, define, _*/
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/services/AccountService',
        'app/widgets/add-external-account/AddExternalAccountWidget',
        'app/widgets/modal/ModalWidget',
        'framework/AlertUtil',
        'framework/ErrorUtil',
        'framework/MessageBus',
        'text!app/widgets/transfer/TransferTemplate.html',
        'jqueryExtensions',
        'jqueryValidationEngineRules'
    ],
    function (
        Message,
        Repository,
        AccountService,
        AddExternalAccountWidget,
        ModalWidget,
        AlertUtil,
        ErrorUtil,
        MessageBus,
        TransferTemplate
    ) {
        'use strict';

        return ModalWidget.extend({
            id: 'transfer-modal',
            className: 'modal-wrapper right form-modal',

            template: {
                name: 'TransferTemplate',
                source: TransferTemplate
            },

            elements: ['transferSymbol'],

            events: (function() {
              // Clone the prototype's events object, then extend it
              // TODO: figure out a better way to do this without instantiating a new object
              return _.extend(_.clone(new ModalWidget().events), {
                'click #transfer-tabbar a': 'selectTab',
                'click select[name=toAccount]': 'processToAccountSelection',
                'click #process-transfer-button': 'processTransfer',
                'click #add-external-account-button': 'addExternalAcoount'
              });
            }()),

            addExternalAcoount: function () {

                this.addChildren([
                    {
                        id: 'AddExternalAccountWidget',
                        viewClass: AddExternalAccountWidget,
                        parentElement: $('body')
                    }
                ]);
                return false;
            },

            initialize: function() {

                this.settings = {
                    id: this.id,
                    title: 'Transfer',
                    type: 'trade',
                    overlay: false,
                    closeButton: true,
                    draggable: true,
                    position: 'right'
                };

              },

            populateSymbolField: function () {
                //get instruments
                var instruments = $.map(Repository.getInstruments(), function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });
                
                $(this.transferSymbolElement).autocomplete({
                        source: instruments
                });
            },

            processToAccountSelection: function (event) {
                //TODO: Find a better way to display empty option for a 'select' tag
                var toAccountDropdown = $(event.currentTarget),
                    emptyOption = toAccountDropdown.find('option[value=""]');

                if (emptyOption) {
                    emptyOption.hide();
                }
            },

            processTransfer: function () {
                //get the form currently being displayed
                var transferRequest,
                    transferForm = $('#transfer-form');

                if (transferForm.validationEngine('validate')) {
                    transferRequest = transferForm.serializeForm();
                    //if the price is non-zero, the request is for securities transfer
                    if (transferRequest.price) {
                        this.transferSecurities(transferRequest);
                    } else {
                        this.transferCash(transferRequest);
                    }
                }
                return false;
            },

            selectTab: function (event) {
                var selectedTab = $(event.currentTarget),
                    prevSelectedTab = $('#transfer-tabbar a.selected'),
                    fieldContainers = $('.transfer-fields-container');

                if (selectedTab[0] !== prevSelectedTab[0]) {
                    $('#transfer-form').validationEngine('hideAll');

                    //toggle display of field containers (securities vs cash)

                    fieldContainers.toggleClass('nodisplay');
                    fieldContainers.find('input').toggleClass('validate[required]');

                    //toggle selected tab
                    selectedTab.toggleClass('selected');
                    prevSelectedTab.toggleClass('selected');

                    //re-attach validation engine
                    $('#transfer-form').validationEngine();
                }
                return false;
            },

            transferCash: function (transferCashRequest) {
                AccountService.transferCash(transferCashRequest.fromAccount,
                    {
                        toAccountId: transferCashRequest.toAccount,
                        amount: transferCashRequest.amount
                    }, _.bind(this.transferProcessed, this), ErrorUtil.showError);
            },

            transferSecurities: function (transferSecuritiesRequest) {
                AccountService.transferSecurities(transferSecuritiesRequest.fromAccount,
                    {
                        toAccountId: transferSecuritiesRequest.toAccount,
                        symbol: transferSecuritiesRequest.symbol,
                        quantity: transferSecuritiesRequest.quantity,
                        pricePaidPerShare: {
                            amount: transferSecuritiesRequest.price,
                            currency: 'USD'
                        }
                    }, _.bind(this.transferProcessed, this), ErrorUtil.showError);
            },

            transferProcessed: function () {
                AlertUtil.showConfirmation('Transfer processed');
                Repository.updateAccounts();
                this.closeModal();
            },

            render: function() {
                var accounts = this.model.toJSON(),
                    applySettings = this.applySettings,
                    settings = this.settings,
                    modalView = this,
                    template = this.getTemplate(),
                    selectedAccount = Repository.getSelectedAccount(),
                    that = this,
                    context = {};

                context.accounts = accounts;
                context.selectedAccount = selectedAccount;
                context.settings = this.settings;

                this.destroyChildren();

                this.$el.html(template(context));
                this._setupElements();

                // Subscribe to events
                this.listenTo(MessageBus, Message.ModalLoad, function(){
                    applySettings(settings);
                });

                this.listenTo(MessageBus, Message.ExternalAccountsUpdated, function() {
                  that.render();
                });

                $(window).on('keyup', function(e) {
                  if (e.which === 27) { // Escape
                    modalView.closeModal();
                  }
                });

                this.postRender(settings);

                _.defer(function () {
                    $('#transfer-form').validationEngine();
                    that.populateSymbolField();
                });

                return this;
            }

        });
    }
);