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
 * bullsfirst/views/AccountTotalsView
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/framework/Formatter'],
       function(Formatter) {
    'use strict';

    return Backbone.View.extend({

        el: '#account-table tfoot',

        initialize: function() {
            this.collection.on('reset', this.render, this);
        },

        render: function() {
            // Calculate totals
            var totalMarketValue = { amount: 0, currency: 'USD'};
            var totalCash = { amount: 0, currency: 'USD'};
            this.collection.each(function(account) {
                totalMarketValue.amount += account.get('marketValue').amount;
                totalCash.amount += account.get('cashPosition').amount;
            });

            this.$el.find('.market-value').html(Formatter.formatMoney(totalMarketValue));
            this.$el.find('.cash').html(Formatter.formatMoney(totalCash));

            return this;
        }
    });
});