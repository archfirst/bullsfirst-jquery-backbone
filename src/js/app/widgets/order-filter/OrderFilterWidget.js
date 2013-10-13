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
 * app/widgets/order-filter/OrderFilterWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/Repository',
        'app/framework/Message',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/order-filter/OrderFilterTemplate.html',
        'select2',
        'stickit',
        'validation'
    ],
    function(Repository, Message, Backbone, BaseView, MessageBus, OrderFilterTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',
            className: 'order-filter',

            template: {
                name: 'OrderFilterTemplate',
                source: OrderFilterTemplate
            },

            elements:['symbol'],

            events: {
                'click .reset-filters-button': 'resetFilters',
                'click .apply-filters-button': 'applyFilters'
            },

            bindings: {
                '.js-account': {
                    observe: 'accountId',
                    selectOptions: {
                        collection: Repository.getBrokerageAccounts(),
                        labelPath: 'name',
                        valuePath: 'id',
                        defaultOption: {
                            label: 'All Accounts',
                            value: null
                        }
                    },
                    setOptions: { validate: true }
                },

                '.js-fromDate': {
                    observe: 'fromDate',
                    setOptions: { validate: true }
                },

                '.js-toDate': {
                    observe: 'toDate',
                    setOptions: { validate: true }
                },

                '.js-orderNumber': {
                    observe: 'orderId',
                    setOptions: { validate: true }
                },

                '.js-symbol': {
                    observe: 'symbol',
                    setOptions: { validate: true }
                },

                '.js-orderAction': {
                    observe: 'sides',
                    setOptions: { validate: true }
                },

                '.js-orderStatus': {
                    observe: 'statuses',
                    setOptions: { validate: true }
                }
            },

            initialize: function() {
                this.model = Repository.getOrderFilterCriteria();
                Backbone.Validation.bind(this);

                this.listenTo(MessageBus, Message.UpdateOrders, this.applyFilters);
            },

            resetFilters: function() {
                Repository.resetOrderFilterCriteria();
            },

            applyFilters: function() {
                Repository.fetchOrders();
            },

            postRender: function() {

                var self = this;
                var instruments = Repository.getInstrumentCollection().getLabelValuePairs();

                $(this.symbolElement).autocomplete({

                    // This function is called every time the user types a character in the text field.
                    //     request.term contains the text currently in the text field
                    //     response is a callback whch expects a single argument, the data to suggest to the user.
                    //     It returns an array of objects with label and value properties:
                    //     [ { label: "Choice1", value: "value1" }, ... ]
                    source: function(request, response) {
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');

                        response($.grep(instruments, function(item) {
                            return matcher.test(item.label);
                        }));
                    },

                    // jQuery UI autocomplete does not trigger a change event when an item is selected.
                    // So force the update of the model manually.
                    select: function(event, ui) {
                        self.model.set('symbol', ui.item.value);
                    }
                });

                this.stickit();
            }
        });
    }
);