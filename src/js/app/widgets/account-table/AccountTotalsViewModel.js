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
 * app/widgets/account-table/AccountTotalsViewModel
 *
 * Model:
 *   brokerageAccounts: Backbone.Collection
 *
 * Attributes:
 *   totalMarketValue: Money
 *   totalCash: Money
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone'
    ],
    function(Backbone) {
        'use strict';

        return Backbone.Model.extend({

            initialize: function(attributes, options) {
                this.brokerageAccounts = options.brokerageAccounts;
                this.listenTo(this.brokerageAccounts, 'reset', this.calculateValues);
                this.calculateValues();
            },

            calculateValues: function() {
                var totalMarketValue = { amount: 0, currency: 'USD'};
                var totalCash = { amount: 0, currency: 'USD'};
                this.brokerageAccounts.each(function(account) {
                    totalMarketValue.amount += account.get('marketValue').amount;
                    totalCash.amount += account.get('cashPosition').amount;
                });

                this.set({
                    totalMarketValue: totalMarketValue,
                    totalCash: totalCash
                });
            }
        });
    }
);