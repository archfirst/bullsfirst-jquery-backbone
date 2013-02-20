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
 * app/domain/Repository
 *
 * This is a singleton object that maintains the domain layer of the application.
 * Domain objects in this layer generally live beyond the life of views in the
 * presentation layer. When views are created, they are generally connected to
 * domain objects that are already present in this repository.
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/domain/BaseAccount',
        'app/domain/BaseAccounts',
        'app/domain/BrokerageAccounts',
        'app/domain/Credentials',
        'app/domain/ExternalAccounts',
        'app/domain/Orders',
        'app/domain/Transactions',
        'app/domain/User',
        'app/services/InstrumentService',
        'framework/ErrorUtil',
        'framework/Formatter',
        'framework/MessageBus',
        'underscore'
    ],
    function(Message, BaseAccount, BaseAccounts, BrokerageAccounts,
     Credentials, ExternalAccounts, Orders, Transactions, User, InstrumentService, ErrorUtil, Formatter, MessageBus, _) {
        'use strict';

        // Module level variables act as singletons
        var _user = new User();
        var _credentials = new Credentials();
        var _baseAccounts = new BaseAccounts();
        var _brokerageAccounts = new BrokerageAccounts();
        var _externalAccounts = new ExternalAccounts();
        var _selectedAccount = null;
        var _instruments = null;
        var _orders = new Orders();
        var _transactions = new Transactions();
        var _orderFilterCriteria = {};
        var _transactionsFilterCriteria = {};

        var _repository = {
            getUser: function() { return _user; },
            getCredentials: function() { return _credentials; },
            getBaseAccounts: function() { return _baseAccounts; },
            getBrokerageAccounts: function() { return _brokerageAccounts; },
            getExternalAccounts: function() { return _externalAccounts; },
            getSelectedAccount: function() { return _selectedAccount; },
            getInstruments: function() { return _instruments; },
            getOrderFilters: function() { return _orderFilterCriteria; },
            getTransactionsFilters: function() { return _transactionsFilterCriteria; },
            getOrders: function() {
                _orders.fetch({
                    data: _orderFilterCriteria
                });
                return _orders;
            },
            getTransactions: function() {
                _transactions.fetch({
                    data: _transactionsFilterCriteria
                });
                return _transactions;
            },

            setOrderFilterCriteria: function( filtercriteria ) {
                _orderFilterCriteria = filtercriteria;
            },

            setTransactionsFilterCriteria: function( filtercriteria ) {
                _transactionsFilterCriteria = filtercriteria;
            },

            getBrokerageAccount: function(id) { return _brokerageAccounts.get(id); },

            initUser: function(attributes) {
                _user.set(attributes);
            },

            initCredentials: function(attributes) {
                _credentials.set(attributes);
            },

            setSelectedAccount: function(account) {
                _selectedAccount = account;
                MessageBus.trigger(Message.SelectedAccountChanged, _selectedAccount);
            },

            setSelectedAccountId: function(accountId) {
                this.setSelectedAccount(_brokerageAccounts.get(accountId));
            },

            reset: function() {
                _user.clear();
                _credentials.clear();
                _baseAccounts.reset();
                _brokerageAccounts.reset();
                _externalAccounts.reset();
                _selectedAccount = null;
            },

            updateAccounts: function() {
                _brokerageAccounts.fetch({
                    success: _.bind(this._updateExternalAccounts, this),
                    error: ErrorUtil.showBackboneError
                });
            },

            _updateExternalAccounts: function() {
                _externalAccounts.fetch({
                    success: _.bind(this._updateExternalAccountsDone, this),
                    error: ErrorUtil.showBackboneError
                });
            },

            _updateExternalAccountsDone: function() {

                this._updateBaseAccounts();

                // Restore currently selected account with a new instance
                // fetched as part of the _brokerageAccounts collection
                if (_selectedAccount)
                {
                    this.setSelectedAccount(_brokerageAccounts.get(_selectedAccount.id));
                }
                if (_selectedAccount === null && _brokerageAccounts.length !== 0)
                {
                    this.setSelectedAccount(_brokerageAccounts.at(0));
                }

                MessageBus.trigger(Message.ExternalAccountsUpdated);
            },

            // Update base accounts (combination of brokerage + external accounts)
            _updateBaseAccounts: function() {

                var accounts = [];

                // Add brokerage accounts
                _brokerageAccounts.each(function(account) {
                    accounts.push(
                        new BaseAccount({
                            id: account.id,
                            displayString: account.get('name') + ' - ' + Formatter.formatMoney(account.get('cashPosition'))
                        }));
                });

                // Add external accounts
                _externalAccounts.each(function(account) {
                    accounts.push(
                        new BaseAccount({
                            id: account.id,
                            displayString: account.get('name') + ' (External)'
                        }));
                });

                // Reset base accounts
                _baseAccounts.reset(accounts);
            },

            updateInstruments: function() {
                InstrumentService.getInstruments( function( data ) { _instruments = data; }, ErrorUtil.showError, this);
            },

            isUserLoggedIn: function() {
                return _credentials.isInitialized();
            }
        };

        // Update accounts whenever user logs in
        MessageBus.on(Message.UserLoggedInEvent, function() {
            _repository.updateAccounts();
            _repository.updateInstruments();
        });

        return _repository;
    }
);