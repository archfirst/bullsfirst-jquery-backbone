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
 *
 * @author Manoj Mehta
 */
 define(
    [
        'backbone',
        'moment'
    ],
    function(Backbone, moment) {
        'use strict';

        return Backbone.Model.extend({
            OrderFilterCriteria: {
                accountId:'',
                fromDate: moment(new Date()).format('YYYY-MM-DD'),
                sides: '',
                statuses: '',
                symbol: '',
                toDate: moment(new Date()).format('YYYY-MM-DD')
            },
       
            getOrderFilterCriteria: function() {
                var _orderFilterCriteria={};
                _.each( this.OrderFilterCriteria, function(value, name) {
                    if ( value!=='' && value !== null) {
                       _orderFilterCriteria[name] = value;
                    }
                });
                return _orderFilterCriteria;
            },
            setOrderFilterCriteria: function( filtercriteria ) {
                if (filtercriteria.fromDate) filtercriteria.fromDate = moment(new Date(filtercriteria.fromDate)).format('YYYY-MM-DD');
                if (filtercriteria.toDate) filtercriteria.toDate = moment(new Date(filtercriteria.toDate)).format('YYYY-MM-DD');
                if (filtercriteria.sides)filtercriteria.sides = filtercriteria.sides.join(',');
                if (filtercriteria.statuses) filtercriteria.statuses = filtercriteria.statuses.join(',');
                this.OrderFilterCriteria = filtercriteria;
            }
        });
    }
);