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
 * app/widgets/user-page-header/UserPageHeaderWidget
 *
 * This is the header widget for the user page.
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/Repository',
        'app/framework/Message',
        'app/widgets/trade/TradeDialog',
        'app/widgets/transfer/TransferDialog',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/user-page-header/UserPageHeaderTemplate.html'
    ],
    function(Repository, Message, TradeDialog, TransferDialog, Backbone, BaseView, MessageBus, UserPageHeaderTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'header',
            className: 'user-page-header',

            template: {
                name: 'UserPageHeaderTemplate',
                source: UserPageHeaderTemplate
            },

            events: {
                'click .js-signOut': 'logout',
                'click .js-tradeButton': 'trade',
                'click .js-transferButton': 'transfer'
            },

            // Constructor options:
            //   model: logged in User model
            initialize: function() {
                this.listenTo(this.model, 'change', this.render);

                // Adjust tab selection on page change
                this.listenTo(MessageBus, Message.PageChange, this.selectTab);
            },

            logout: function(event) {
                event.preventDefault();

                // Do a full page refresh to start from scratch
                Backbone.history.navigate('', false);
                window.location.reload();
            },

            trade: function() {

                this.addChildren([
                    {
                        id: 'TradeDialog',
                        viewClass: TradeDialog,
                        parentElement: this.$el,
                        options: {
                            model: {
                                accounts: Repository.getBrokerageAccounts().toJSON(),
                                selectedAccount: Repository.getSelectedAccount()
                            }
                        }
                    }
                ]);

            },

            transfer: function() {

                this.addChildren([
                    {
                        id: 'TransferDialog',
                        viewClass: TransferDialog,
                        parentElement: this.$el,
                        options: {
                            model: {
                                accounts: Repository.getBaseAccounts().toJSON(),
                                selectedAccount: Repository.getSelectedAccount()
                            }
                        }
                    }
                ]);
            },

            selectTab: function(page) {
                this.$el.find('.tabbar a').each(function() {
                    if ($(this).attr('href') === page) {
                        $(this).addClass('selected');
                    }
                    else {
                        $(this).removeClass('selected');
                    }
                });
            }
        });
    }
);