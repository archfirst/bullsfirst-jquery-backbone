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
        'framework/BaseView',
        'framework/MessageBus',
        'jquery',
        'moment',
        'jqueryselectbox'
    ],
    
    function( Message, BaseView, MessageBus, $, moment ) {
        'use strict';
        

        return BaseView.extend({

			tagName: 'div',

            initialize: function(){
				this.render();
                this.collection.bind('reset', this.render, this);
                this.listenTo(MessageBus, Message.PageChange, function(){
                    this.styleFormElements(this.tab);
                });
			},

            postRender: function(){
                // Subscribe to events
                MessageBus.on(Message.TransactionFilterReset, this.resetFilter, this);
                MessageBus.on(Message.TransactionFilterApply, this.updateTransactions, this);
                MessageBus.on('UpdateTransactions', this.updateTransactions, this);
                
            },

            resetDatepicker: function(tab){
                $('#' + tab + '-fromDate').datepicker('setDate', new Date());
                $('#' + tab + '-toDate').datepicker('setDate', new Date());
            },

			resetFilter: function(tab) {
                this.resetSelectbox(tab);
				this.resetDatepicker(tab);
			},

            resetSelectbox: function(tab){
                document.getElementById(tab + '-filter-accountId').selectedIndex = 0;
                $('#' + tab + '-filter-form a.sbSelector').html( $('#' + tab + '-filter-form select option:first-child').html() );
            },
          
            styleFormElements: function(tab){
                // Style select boxes
                $('#' + tab + '-filter-form select').selectbox();

                // Create date pickers
                $('#' + tab + '-fromDate').datepicker();
                $('#' + tab + '-toDate').datepicker();

                this.resetDatepicker(tab);
            },

			updateTransactions: function(tab) {

                // Process filter criteria to server format
				var filterCriteria = {},
                    accountId = $('#' + tab + '-filter-accountId').val();

                if ( accountId > 0 ) {
                    filterCriteria.accountId = accountId;
                }

				if ( $('#' + tab + '-fromDate').val().length > 0 ) {
					filterCriteria.fromDate = moment( $('#' + tab + '-fromDate').datepicker('getDate') ).format('YYYY-MM-DD');
				}

				if ( $('#' + tab + '-toDate').val().length > 0 ) {
					filterCriteria.toDate = moment( $('#' + tab + '-toDate').datepicker('getDate') ).format('YYYY-MM-DD');
				}

				// Send OrderFilterChanged message with filter criteria
				MessageBus.trigger('TransactionFilterChanged', filterCriteria);
			}
                        
        });
    }
);