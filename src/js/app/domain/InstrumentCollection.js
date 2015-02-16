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
 * app/domain/InstrumentCollection
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/framework/AppConfig',
        'backbone'
    ],
    function(AppConfig, Backbone) {
        'use strict';

        return Backbone.Collection.extend({
            model: Backbone.Model,
            url: AppConfig.exchApi + '/instruments',

            getLabelValuePairs: function() {
                return this.map(function(instrument) {
                    var symbol = instrument.get('symbol');
                    var name = instrument.get('name');
                    return {
                        label: symbol + ' (' + name + ')',
                        value: symbol
                    };
                });
            }
        });
    }
);