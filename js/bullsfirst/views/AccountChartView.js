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
 * bullsfirst/views/AccountChartView
 *
 * @author Naresh Bhatia
 */
define(function() {

    var accounts_title = 'All Accounts';
    var accounts_subtitle = 'Click on an account to view positions';
    var MAX_POINTS = 10;
    var colors = [
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#fde79c'], [1, '#f6bc0c']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#b9d6f7'], [1, '#284b70']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#fbb7b5'], [1, '#702828']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#b8c0ac'], [1, '#5f7143']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#a9a3bd'], [1, '#382c6c']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#98c1dc'], [1, '#0271ae']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#9dc2b3'], [1, '#1d7554']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#b1a1b1'], [1, '#50224f']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#c1c0ae'], [1, '#706e41']] },
        { radialGradient: {cx: 0, cy: 0, r: 1}, stops: [[0, '#adbdc0'], [1, '#446a73']] }
    ];

    return Backbone.View.extend({

        el: '#accounts-chart',

        initialize: function(options) {
            this.collection.bind('reset', this.render, this);
        },

        render: function() {
            var context = this;

            // Convert accounts collection to a structure understood by the Highcharts
            this.accounts = this.collection.map(function(account) {
                return {
                    name: account.get('name'),
                    y: account.get('marketValue').amount
                };
            });

            // Sort accounts by descending market value and assign colors
            this.accounts = _.sortBy(this.accounts, function(account) { return -account.y; }) ;
            _.each(this.accounts, function(account, index) {
                account.color = colors[index % MAX_POINTS];
            }, this);

            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'accounts-chart',
                    backgroundColor: '#D8D8D8',
                    borderRadius: 0,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: accounts_title,
                    align: 'left',
                    style: {
                        font: '14px Aller',
                        color: '#000000'
                    },
                    floating: true,
                    x: 0,
                    y: 10
                },
                subtitle: {
                    text: accounts_subtitle,
                    align: 'left',
                    verticalAlign: 'bottom',
                    style: {
                        font: '200 italic 11px Aller',
                        color: '#3F3F3F'
                    },
                    floating: true,
                    x: 0,
                    y: 4
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false  // disable labels on each pie
                        },
                        shadow: false,
                        size: '95%',
                        point: {
                            events: {
                                click: function(event) {
                                    console.log(event.point.name + ' - clicked');
                                },
                                mouseOver: function(event) {
                                    console.log(event.target.name);
                                }
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'All Accounts',
                    data: context.accounts
                }]
            });

            return this;
        }
    });
});