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
 * bullsfirst/domain/UserContext
 *
 * This is a singleton object that maintains the context of the logged in user.
 * The context consists of the following:
 *   user: User
 *   credentials: Credentials
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/domain/BaseAccount',
        'bullsfirst/domain/BaseAccounts',
        'bullsfirst/domain/BrokerageAccounts',
        'bullsfirst/domain/Credentials',
        'bullsfirst/domain/ExternalAccounts',
        'bullsfirst/domain/User',
        'bullsfirst/framework/ErrorUtil',
        'bullsfirst/framework/Formatter',
        'bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus'],
       function(BaseAccount, BaseAccounts, BrokerageAccounts, Credentials, ExternalAccounts, User, ErrorUtil, Formatter, Message, MessageBus) {
    'use strict';

    // Module level variables act as singletons
    var _user = new User();
    var _credentials = new Credentials();
    var _baseAccounts = new BaseAccounts();
    var _brokerageAccounts = new BrokerageAccounts();
    var _externalAccounts = new ExternalAccounts();
    var _selectedAccount = null;

    return {
        getUser: function() { return _user; },
        getCredentials: function() { return _credentials; },
        getBaseAccounts: function() { return _baseAccounts; },
        getBrokerageAccounts: function() { return _brokerageAccounts; },
        getExternalAccounts: function() { return _externalAccounts; },
        getSelectedAccount: function() { return _selectedAccount; },

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

        isUserLoggedIn: function() {
            return _credentials.isInitialized();
        }
    };
});