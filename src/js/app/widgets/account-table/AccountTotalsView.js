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
 * app/widgets/account-table/AccountTotalsView
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/widgets/account-table/AccountTotalsViewModel',
        'keel/BaseView',
        'text!app/widgets/account-table/AccountTotalsTemplate.html'
    ],
    function(AccountTotalsViewModel, BaseView, AccountTotalsTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'tr',

            template: {
                name: 'AccountTotalsTemplate',
                source: AccountTotalsTemplate
            },

            // Constructor options:
            //   collection: collection of brokerage accounts
            initialize: function() {
                this.model = new AccountTotalsViewModel(null, {
                    brokerageAccounts: this.collection
                });
                this.listenTo(this.model, 'change', this.render);
            }
        });
    }
);