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
 * app/widgets/transaction-filter/TransactionsFilterWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/widgets/filter/FilterWidget',
        'backbone',
        'framework/BaseView',
        'framework/MessageBus',
        'moment',
        'text!app/widgets/order-filter/OrdersFilterTemplate.html',
        'jqueryselectbox'
    ],
    function(Message, Repository, FilterWidget, Backbone, BaseView, MessageBus, moment, OrdersFilterTemplate) {
        'use strict';

        return FilterWidget.extend({
            tagName: 'div',
            className: 'orders',

            tab: 'orders',

            template: {
                name: 'OrderssFilterTemplate',
                source: OrdersFilterTemplate
            },

            elements:['ordersFilterForm','ordersFilterSymbol'],

            events: {
                'click #orders-filter .js-reset-filters-button' : 'resetFilters',
                'click #orders-filter .js-apply-filters-button' : 'updateOrders'
            },

            initialize: function() {

                FilterWidget.prototype.initialize.call(this);
                
                this.listenTo(MessageBus, Message.UpdateOrders, function(){
                    this.updateOrders();
                });

                this.listenTo(MessageBus, Message.FilterLoaded, this.orderFilterLoad );
            },

            postPlace: function() {
                this._initSymbolField();
            },

            orderFilterLoad: function() {

                if ( _.isEmpty( Repository.getOrderFilters() ) ) {
                    this.setFilterCriteria();
                }
                else {
                    var orderFilter = Repository.getOrderFilters();

                    _.each(orderFilter, function( value, prop ) {
                        //
                        var _element = $(this.ordersFilterFormElement).find('[name="'+prop+'"]');
                        //
                        if (value && _element.hasClass('datepicker')) {
                            _element.datepicker('setDate', new Date(value));
                        }
                        else if ( _element.is('select') ) {
                            //detach the selectbox from UI
                            _element.selectbox('detach');
                            // set the value to select tag
                            _element.val(value);
                            // again attach the select box to populate on set value of select tag
                            _element.selectbox('attach');
                        }
                        // check for tags with type checkbox and name is prop[]
                        else if ( $(this.ordersFilterFormElement).find('input[name="'+prop+'[]"]').is(':checkbox')) {
                            var valuearr = value.split(',');
                            $(this.ordersFilterFormElement).find('input[name="'+prop+'[]"]').val(valuearr);
                        }
                        else {
                            _element.prop( 'value', value );
                        }
                    },this);
                }
                
                Repository.getOrders();
            },
            
            resetFilters: function() {
                //selectbox and datepicker reset inhertied from the filterWidget
                $(this.ordersFilterFormElement).find('#orders-filter-accountId').selectbox('detach');
                $(this.ordersFilterFormElement).find('#orders-filter-accountId').val('');
                $(this.ordersFilterFormElement).find('#orders-filter-accountId').selectbox('attach');
                $(this.ordersFilterFormElement).find('input:text').prop('value', '');
                $(this.ordersFilterFormElement).find('#orders-fromDate').datepicker('setDate', new Date());
                $(this.ordersFilterFormElement).find('#orders-toDate').datepicker('setDate', new Date());
                $(this.ordersFilterFormElement).find('input:checkbox').prop('checked', false);
                this.updateOrders();
            },

            setFilterCriteria: function() {
                var filtercriteria = $(this.ordersFilterFormElement).toObject();
                if (filtercriteria.fromDate) {
                    filtercriteria.fromDate = moment(new Date(filtercriteria.fromDate)).format('YYYY-MM-DD');
                }
                if (filtercriteria.toDate) {
                    filtercriteria.toDate = moment(new Date(filtercriteria.toDate)).format('YYYY-MM-DD');
                }
                if (filtercriteria.sides) {
                    filtercriteria.sides = filtercriteria.sides.join(',');
                }
                if (filtercriteria.statuses){
                    filtercriteria.statuses = filtercriteria.statuses.join(',');
                }
                 Repository.setOrderFilterCriteria( filtercriteria );
            },
            
            updateOrders: function() {
                // Process filter criteria to server format
                this.setFilterCriteria();
                Repository.getOrders();
            },
            render: function(){
                var template = this.getTemplate(),
                    collection = this.collection || {},
                    context = {};

                // If the collection contains a toJSON method, call it to create the context
                context.accounts = collection.toJSON ? collection.toJSON() : [];

                // Destroy existing children
                this.destroyChildren();

                this.$el.html(template(context));
                this._setupElements();

                this.postRender();
                return this;
            },

            _initSymbolField: function() {
                
                var instruments = $.map(Repository.getInstruments(), function(instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });

                $(this.ordersFilterSymbolElement).autocomplete({
                  source: instruments
                });

                return instruments;
      
            }
        });
    }
);