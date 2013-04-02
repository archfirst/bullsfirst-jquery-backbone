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
 * app/services/BrokerageAccountService
 *
 * Proxy for BrokerageAccount resource on the server. This module was created seperately
 * (instead of adding it to the BrokerageAccount model), because it was difficult to
 * retrofit this functionality into Backbone's CRUD mechanism. For example, to create
 * a BrokerageAccount we need to send an "accountName" attribute to the server, whereas
 * the BrokerageAccount calls this attribute "name".
 *
 * @author Naresh Bhatia
 */
define(['app/domain/Repository',
        'app/framework/AjaxUtil'],
       function(Repository, AjaxUtil) {
    'use strict';

    // Module level variables act as singletons
    var _url = '/bfoms-javaee/rest/secure/brokerage_accounts';

    return {
        // accountName: name of account to create
        // doneCallbacks: a function, or array of functions, called when the Deferred is resolved
        // failCallbacks: a function, or array of functions, called when the Deferred is rejected
        createBrokerageAccount: function(accountName, doneCallbacks, failCallbacks) {
            $.ajax({
                url: _url,
                type: 'POST',
                beforeSend: function(xhr) {
                    AjaxUtil.setAuthorizationHeader(xhr, Repository.getCredentials());
                },
                contentType: 'application/json',
                data: '{ "accountName": "' + accountName + '" }'
            })
            .then(doneCallbacks, failCallbacks);
        }
    };
});