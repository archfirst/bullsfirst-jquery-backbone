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
 * app/services/AccountService
 *
 * Proxy for Account resource on the server.
 *
 * @author Naresh Bhatia
 */
define(['app/domain/Repository',
        'framework/AjaxUtil'],
       function(Repository, AjaxUtil) {
    'use strict';

    // Module level variables act as singletons
    var _url = '/bfoms-javaee/rest/secure/accounts';

    return {
        changeName: function(accountId, newName, doneCallbacks, failCallbacks) {
            $.ajax({
                url: _url + '/' + accountId + '/change_name',
                type: 'POST',
                beforeSend: function(xhr) {
                    AjaxUtil.setAuthorizationHeader(xhr, Repository.getCredentials());
                },
                contentType: 'application/json',
                data: '{ "newName": "' + newName + '" }'
            })
            .then(doneCallbacks, failCallbacks);
        },

        transferCash: function(fromAccountId, transferCashRequest, doneCallbacks, failCallbacks) {
            $.ajax({
                url: _url + '/' + fromAccountId + '/transfer_cash',
                type: 'POST',
                beforeSend: function(xhr) {
                    AjaxUtil.setAuthorizationHeader(xhr, Repository.getCredentials());
                },
                contentType: 'application/json',
                data: JSON.stringify(transferCashRequest, null, '\t')
            })
            .then(doneCallbacks, failCallbacks);
        },

        transferSecurities: function(fromAccountId, transferSecuritiesRequest, doneCallbacks, failCallbacks) {
            $.ajax({
                url: _url + '/' + fromAccountId + '/transfer_securities',
                type: 'POST',
                beforeSend: function(xhr) {
                    AjaxUtil.setAuthorizationHeader(xhr, Repository.getCredentials());
                },
                contentType: 'application/json',
                data: JSON.stringify(transferSecuritiesRequest, null, '\t')
            })
            .then(doneCallbacks, failCallbacks);
        }
    };
});