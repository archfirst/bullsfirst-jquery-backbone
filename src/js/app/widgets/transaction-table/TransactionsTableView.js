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
 * app/widgets/transaction-table/TransactionsTableView
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/widgets/transaction-table/TransactionView',
        'framework/BaseView',
        'framework/Formatter',
        'framework/MessageBus',
        'moment'
    ],
    
    function( Message, TransactionView, BaseView, Formatter, MessageBus, moment ) {
        'use strict';
        

        return BaseView.extend({

            initialize: function(){

				this.collection.bind('reset', this.render, this);

				// Subscribe to events
				MessageBus.on('TransactionFilterChanged', function(filterCriteria) {
					this.collection.fetch({data: filterCriteria});
				}, this);

			},

			render: function(){

                var transactions = this.collection;

                $(this.options.el).html('');

                // Create new views for each transaction
                transactions.each( function(model) {
                    this.renderTransaction(model);
                }, this);

                return this;

			},

            renderTransaction: function(transaction){
                
                // Set boolean if negative value so can add styling class
                if ( transaction.attributes.amount.amount < 0 ) {
                    transaction.attributes.negativeAmount = true;
                }

                var view = this.addChild({
                    id: transaction.id,
                    viewClass: TransactionView,
                    parentElement: this.$el.selector,
                    options: {
                        model: transaction
                    }
                });

                return view;
            }

        });
    }
);