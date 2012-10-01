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
 * bullsfirst/framework/Formatter
 *
 * Functions formatting data
 *
 * @author Naresh Bhatia
 */
define(function() {

    return {
        formatMoney: function(money) {
            if ((typeof money === 'undefined') || (money === null)) {
                return "";
            }
            else {
                return '$' + $.format.number(money.amount, '#,##0.00');
            }
        },

        // Formats a fraction as a percentage.
        // For example formatPercent(0.25) = "25.00%"
        formatPercent: function(fraction, digits) {
            if ((typeof fraction === 'undefined') || (fraction === null)) {
                return "";
            }
            else {
                if (typeof digits === 'undefined')
                    digits = 2;
                return (fraction * 100).toFixed(digits) + '%';
            }
        },

        formatMoment2Date: function(m) {
            if ((typeof m === 'undefined') || (m === null)) {
                return "";
            }
            else {
                return m.format('MM/DD/YYYY');
            }
        },

        formatMoment2DateTime: function(m) {
            if ((typeof m === 'undefined') || (m === null)) {
                return "";
            }
            else {
                return m.format('MM/DD/YYYY hh:mm:ss A');
            }
        }
    };
});