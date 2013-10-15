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
        'app/domain/BaseAccount',
        'app/domain/BaseAccounts',
        'app/domain/BrokerageAccounts',
        'app/domain/Credentials',
        'app/domain/ExternalAccounts',
        'app/domain/InstrumentCollection',
        'app/domain/OrderFilterCriteria',
        'app/domain/Orders',
        'app/domain/TransactionFilterCriteria',
        'app/domain/Transactions',
        'app/domain/User',
        'app/framework/ErrorUtil',
        'app/framework/Formatter',
        'app/framework/Message',
        'backbone',
        'keel/MessageBus',
        'moment',
        'underscore'
    ],
    function(
        BaseAccount,
        BaseAccounts,
        BrokerageAccounts,
        Credentials,
        ExternalAccounts,
        InstrumentCollection,
        OrderFilterCriteria,
        Orders,
        TransactionFilterCriteria,
        Transactions,
        User,
        ErrorUtil,
        Formatter,
        Message,
        Backbone,
        MessageBus,
        moment,
        _
    ) {
        'use strict';

        // Module level variables act as singletons
        var _user = new User();
        var _credentials = new Credentials();
        var _baseAccounts = new BaseAccounts();
        var _brokerageAccounts = new BrokerageAccounts();
        var _externalAccounts = new ExternalAccounts();
        var _selectedAccount = null;
        var _instrumentCollection = new InstrumentCollection();
        var _orders = new Orders();
        var _transactions = new Transactions();
        var _orderFilterCriteria = new OrderFilterCriteria();
        var _transactionFilterCriteria = new TransactionFilterCriteria();

        var _resetOrderFilterCriteria = function() {
            _orderFilterCriteria.clear();
            _orderFilterCriteria.set({
                fromDate: moment(new Date()).format('YYYY-MM-DD'),
                toDate: moment(new Date()).format('YYYY-MM-DD')
            });
        };

        var _resetTransactionFilterCriteria = function() {
            _transactionFilterCriteria.clear();
            _transactionFilterCriteria.set({
                fromDate: moment(new Date()).format('YYYY-MM-DD'),
                toDate: moment(new Date()).format('YYYY-MM-DD')
            });
        };

        _instrumentCollection.fetch();
        _resetOrderFilterCriteria();
        _resetTransactionFilterCriteria();

        var _repository = {
            getUser: function() { return _user; },
            getCredentials: function() { return _credentials; },
            getBaseAccounts: function() { return _baseAccounts; },
            getBrokerageAccounts: function() { return _brokerageAccounts; },
            getExternalAccounts: function() { return _externalAccounts; },
            getSelectedAccount: function() { return _selectedAccount; },
            getInstrumentCollection: function() { return _instrumentCollection; },
            getOrders: function() { return _orders; },
            getTransactions: function() { return _transactions; },
            getOrderFilterCriteria: function() { return _orderFilterCriteria; },
            getTransactionFilterCriteria: function() { return _transactionFilterCriteria; },

            fetchOrders: function() {

                // Remove empty elements because server does not understand them
                var filterCriteria = _orderFilterCriteria.toJSON();

                if (filterCriteria.accountId === null) {
                    delete filterCriteria.accountId;
                }

                if (filterCriteria.fromDate === '') {
                    delete filterCriteria.fromDate;
                }

                if (filterCriteria.toDate === '') {
                    delete filterCriteria.toDate;
                }

                if (filterCriteria.orderId === '') {
                    delete filterCriteria.orderId;
                }

                if (typeof filterCriteria.symbol === 'string') {
                    if (filterCriteria.symbol === '') {
                        delete filterCriteria.symbol;
                    }
                    else {
                        filterCriteria.symbol = filterCriteria.symbol.toUpperCase();
                    }
                }

                if (filterCriteria.sides && filterCriteria.sides.length > 0) {
                    filterCriteria.sides = filterCriteria.sides.join();
                }

                if (filterCriteria.statuses && filterCriteria.statuses.length > 0) {
                    filterCriteria.statuses = filterCriteria.statuses.join();
                }

                _orders.fetch({
                    data: filterCriteria,
                    reset: true
                });
            },

            resetOrderFilterCriteria: function() {
                _resetOrderFilterCriteria();
            },

            fetchTransactions: function() {
                // Remove empty elements because server does not understand them
                var filterCriteria = _transactionFilterCriteria.toJSON();

                if (filterCriteria.accountId === null) {
                    delete filterCriteria.accountId;
                }

                if (filterCriteria.fromDate === '') {
                    delete filterCriteria.fromDate;
                }

                if (filterCriteria.toDate === '') {
                    delete filterCriteria.toDate;
                }

                _transactions.fetch({
                    data: filterCriteria,
                    reset: true
                });
            },

            resetTransactionFilterCriteria: function() {
                _resetTransactionFilterCriteria();
            },

            getBrokerageAccount: function(id) { return _brokerageAccounts.get(id); },

            setSelectedAccount: function(account) {
                _selectedAccount = account;
                MessageBus.trigger(Message.SelectedAccountChanged, _selectedAccount);
            },

            setSelectedAccountId: function(accountId) {
                this.setSelectedAccount(_brokerageAccounts.get(accountId));
            },

            updateAccounts: function() {
                _brokerageAccounts.fetch({
                    reset: true,
                    success: _.bind(this._updateExternalAccounts, this),
                    error: ErrorUtil.showBackboneError
                });
            },

            _updateExternalAccounts: function() {
                _externalAccounts.fetch({
                    reset: true,
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
            }
        };

        // Update accounts whenever user logs in
        MessageBus.on(Message.UserLoggedInEvent, function() {
            _repository.updateAccounts();
        });

        // Fetch latest list of orders when an order is submitted
        MessageBus.on(Message.OrderSubmissionSuccessful, function() {
            _repository.fetchOrders();
        });

        // Fetch latest list of orders when an order is canceled
        MessageBus.on(Message.OrderCancellationSuccessful, function() {
            _repository.fetchOrders();
        });

        return _repository;
    }
);