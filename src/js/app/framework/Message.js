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
 * app/framework/Message
 *
 * Enumeration of messages
 *
 * @author Naresh Bhatia
 */
define([
    'keel/Message',
    'underscore'
],
function(frameworkMessage, _) {
    'use strict';

    var message =  _.extend({
        AccountClick: 'Account:click',
        AccountClickEditIconRaw: 'Account:clickEditIconRaw',
        AccountClickRaw: 'Account:clickRaw',
        AccountMouseOut: 'Account:mouseout',
        AccountMouseOutRaw: 'Account:mouseoutRaw',
        AccountMouseOver: 'Account:mouseover',
        AccountMouseOverRaw: 'Account:mouseoverRaw',
        AccountStoppedEditing: 'Account:stoppedEditing',
        ExternalAccountsUpdated: 'ExternalAccounts:Updated',
        ModalLoad: 'Modal:load',
        FilterLoaded: 'FilterLoaded',
        OrderFilterApply: 'Order:clickFilterApply',
        OrderFilterChanged: 'Order:orderFilterChanged',
        OrderFilterReset: 'Order:clickFilterReset',
        SelectedAccountChanged: 'SelectedAccountChanged',
        TabSelectionRequest: 'TabSelectionRequest',
        TradeCostUpdate: 'TradeCostUpdate',
        TradeRequest: 'TradeRequest',
        TradeSymbolChange: 'TradeSymbolChange',
        TransactionFilterApply: 'Transaction:clickFilterApply',
        TransactionFilterChanged: 'Transaction:transactionFilterChanged',
        TransactionFilterReset: 'Transaction:clickFilterReset',
        UpdateOrders: 'UpdateOrders',
        UpdateTransactions: 'UpdateTransactions',
        UserLoggedInEvent: 'UserLoggedInEvent',
        UserLoggedOutEvent: 'UserLoggedOutEvent'
    }, frameworkMessage);

    return message;

});