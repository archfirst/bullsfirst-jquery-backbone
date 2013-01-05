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
 * bullsfirst/services/OrderEstimateService
 *
 * Proxy for OrderEstimate resource on the server.
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/domain/UserContext',
        'bullsfirst/framework/AjaxUtil'],
       function(UserContext, AjaxUtil) {
    'use strict';

    // Module level variables act as singletons
    var _url = '/bfoms-javaee/rest/secure/order_estimates';

    return {
        // orderRequest: see http://archfirst.org/books/bullsfirst-rest-service#order_estimates
        // doneCallbacks: a function, or array of functions, called when the Deferred is resolved
        // failCallbacks: a function, or array of functions, called when the Deferred is rejected
        createOrderEstimate: function(orderRequest, doneCallbacks, failCallbacks) {
            $.ajax({
                url: _url,
                type: 'POST',
                beforeSend: function(xhr) {
                    AjaxUtil.setAuthorizationHeader(xhr, UserContext.getCredentials());
                },
                contentType: 'application/json',
                data: JSON.stringify(orderRequest, null, '\t')
            })
            .then(doneCallbacks, failCallbacks);
        }
    };
});