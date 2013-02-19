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
 * app/widgets/filter/FilterWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'framework/BaseView',
        'framework/MessageBus',
        'jquery',
        'moment',
        'jqueryselectbox'
    ],
    
    function( Message, Repository, BaseView, MessageBus, $, moment ) {
        'use strict';
        

        return BaseView.extend({

			tagName: 'div',

            initialize: function(){
				var that = this;
                this.render();
                this.collection.bind('reset', this.render, this);
                this.listenTo(MessageBus, Message.FilterLoaded, function(){
                    that.styleFormElements(that.tab);
                });
			},

            postRender: function(){
                // Subscribe to events
                this.listenTo(MessageBus, Message.TransactionFilterReset, this.resetFilter);
                this.listenTo(MessageBus, Message.TransactionFilterApply, this.updateTransactions);
                this.listenTo(MessageBus, Message.UpdateTransactions, this.updateTransactions);
            },

            setFilters: function( formElement ){
                var orderFilter = Repository.getOrderFilters();

                _.each(orderFilter, function( value, prop ) {
                    //
                    var _element = formElement.find('[name="'+prop+'"]');
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
                    else if ( formElement.find('input[name="'+prop+'[]"]').is(':checkbox')) {
                        var valuearr = value.split(',');
                        formElement.find('input[name="'+prop+'[]"]').val(valuearr);
                    }
                    else {
                        _element.prop( 'value', value );
                    }
                },this);
            },

            resetDatepicker: function(tab){
                $('.js-' + tab + 'FromDate').datepicker('setDate', new Date());
                $('.js-' + tab + 'ToDate').datepicker('setDate', new Date());
            },

			resetFilter: function(tab) {
                this.resetSelectbox(tab);
				this.resetDatepicker(tab);
			},

            resetSelectbox: function(tab){
                $('.js-' + tab + 'FilterAccountId').prop('selectedIndex', 0);
                $('.js-' + tab + 'FilterForm a.sbSelector').html( $('.js-' + tab + 'FilterForm select option:first-child').html() );
            },
          
            styleFormElements: function(tab){
                // Style select boxes
                $('.js-' + tab + 'FilterForm select').selectbox();

                // Create date pickers
                $('.js-' + tab + 'FromDate').datepicker();
                $('.js-' + tab + 'ToDate').datepicker();

                this.resetDatepicker(tab);
            },

			updateTransactions: function(tab) {
                // Process filter criteria to server format
				var filterCriteria = {},
                    accountId = $('.js-' + tab + 'FilterAccountId').val();

                if ( accountId > 0 ) {
                    filterCriteria.accountId = accountId;
                }

				if ( $('.js-' + tab + 'FromDate').val().length > 0 ) {
					filterCriteria.fromDate = moment( $('.js-' + tab + 'FromDate').datepicker('getDate') ).format('YYYY-MM-DD');
				}

				if ( $('.js-' + tab + 'ToDate').val().length > 0 ) {
					filterCriteria.toDate = moment( $('.js-' + tab + 'ToDate').datepicker('getDate') ).format('YYYY-MM-DD');
				}

				// Send OrderFilterChanged message with filter criteria
				MessageBus.trigger(Message.TransactionFilterChanged, filterCriteria);
			}
                        
        });
    }
);