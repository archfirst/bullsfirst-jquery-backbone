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
define(
    [
        'backbone',
        'app/common/Message',
        'framework/MessageBus',
        'highcharts',
        'underscore'
    ],
    function(Backbone, Message, MessageBus, Highcharts, _) {
        'use strict';

        var ACCOUNTS_TITLE = 'All Accounts';
        var ACCOUNTS_SUBTITLE = 'Click on an account to view positions';
        var MAX_POINTS = 10;
        var colors = [
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#fde79c'], [1, '#f6bc0c']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#b9d6f7'], [1, '#284b70']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#fbb7b5'], [1, '#702828']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#b8c0ac'], [1, '#5f7143']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#a9a3bd'], [1, '#382c6c']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#98c1dc'], [1, '#0271ae']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#9dc2b3'], [1, '#1d7554']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#b1a1b1'], [1, '#50224f']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#c1c0ae'], [1, '#706e41']] },
            { radialGradient: {cx: 0, cy: 0, r: 1, gradientUnits: 'objectBoundingBox'}, stops: [[0, '#adbdc0'], [1, '#446a73']] }
        ];

        return Backbone.View.extend({

            chart: null,

            initialize: function() {
                this.collection.on('reset', this.render, this);

                // Subscribe to events
                MessageBus.on(Message.AccountMouseOver, this.handleMouseOver, this);
                MessageBus.on(Message.AccountMouseOut, this.handleMouseOut, this);
            },

            handleMouseOver: function(accountId) {
                this.chart.get(accountId).select(true);
            },

            handleMouseOut: function(accountId) {
                this.chart.get(accountId).select(false);
            },

            render: function() {
                // Convert accounts collection to a structure understood by the Highcharts
                var accounts = this.collection.map(function(account) {
                    return {
                        id: account.get('id'),
                        name: account.get('name'),
                        y: account.get('marketValue').amount
                    };
                });

                // Sort accounts by descending market value and assign colors
                accounts = _.sortBy(accounts, function(account) { return -account.y; }) ;
                _.each(accounts, function(account, index) {
                    account.color = colors[index % MAX_POINTS];
                }, this);

                this.chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'accounts-chart',
                        backgroundColor: '#D8D8D8',
                        borderRadius: 0,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: ACCOUNTS_TITLE,
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
                        text: ACCOUNTS_SUBTITLE,
                        align: 'left',
                        verticalAlign: 'bottom',
                        style: {
                            font: 'italic 11px Aller',
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
                            borderColor: 'none',
                            size: '95%',
                            point: {
                                events: {
                                    mouseOver: function(event) {
                                        MessageBus.trigger(Message.AccountMouseOverRaw, event.currentTarget.id);
                                    },
                                    mouseOut: function(event) {
                                        MessageBus.trigger(Message.AccountMouseOutRaw, event.currentTarget.id);
                                    },
                                    click: function(event) {
                                        MessageBus.trigger(Message.AccountClickRaw, event.currentTarget.id);
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'All Accounts',
                        data: accounts
                    }]
                });

                return this;
            }
        });
    }
);