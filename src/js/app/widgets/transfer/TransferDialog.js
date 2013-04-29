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
 * app/widgets/transfer/TransferDialog
 *
 * @author Vikas Goyal
 */
define(
    [
        'app/domain/Repository',
        'app/framework/Message',
        'app/services/AccountService',
        'app/framework/AlertUtil',
        'app/framework/ErrorUtil',
        'app/framework/ModalDialog',
        'app/widgets/add-external-account/AddExternalAccountDialog',
        'keel/MessageBus',
        'text!app/widgets/transfer/TransferTemplate.html',
        'underscore',
        'jqueryExtensions',
        'jqueryValidationEngineRules'
    ],
    function (
        Repository,
        Message,
        AccountService,
        AlertUtil,
        ErrorUtil,
        ModalDialog,
        AddExternalAccountDialog,
        MessageBus,
        TransferTemplate,
        _
    ) {
        'use strict';

        return ModalDialog.extend({
            id: 'transfer-dialog',
            className: 'modal theme-a',

            template: {
                name: 'TransferTemplate',
                source: TransferTemplate
            },

            elements: ['transferSymbol'],

            events: {
                'click #add-external-account-button': 'addExternalAcoount',
                'click #process-transfer-button': 'processTransfer',
                'click .bf-radio': 'selectTab',
                'click .close-button': 'close',
                'click select[name=toAccount]': 'processToAccountSelection'
            },

            initialize: function() {
                this.settings = {
                    draggable: true
                };

                this.listenTo(MessageBus, Message.ExternalAccountsUpdated, this.render);
            },

            addExternalAcoount: function () {
                var externalAccountDialog = this.addChild({
                    id: 'AddExternalAccountDialog',
                    viewClass: AddExternalAccountDialog,
                    parentElement: $('body')
                });

                // Stack above this dialog box
                externalAccountDialog.stack();

                return false;
            },

            postPlace: function() {
                ModalDialog.prototype.postPlace.call(this);

                $('#fromAccount, #toAccount').selectbox({effect: 'fade'});
                this._initSymbolField();

                this.$el.find('form').validationEngine();

                return this;
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
                var selectedTab = $(event.currentTarget);
                var prevSelectedTab = $('#transfer-tabbar a.selected');
                var fieldContainers = $('.transfer-fields-container');

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
                this.close();
            },

            _initSymbolField: function () {
                var instruments = $.map(Repository.getInstruments(), function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });

                $(this.transferSymbolElement).autocomplete({
                    source: instruments
                });
            }
        });
    }
);