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
 * bullsfirst/views/AccountSelectorView
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone',
        'app/domain/Repository',
        'framework/Formatter',
        'framework/MessageBus',
        'bullsfirst/views/TemplateManager'
    ],
    function(Backbone, Repository, Formatter, MessageBus, TemplateManager) {
        'use strict';

        return Backbone.View.extend({

            events: {
                'change': 'setSelectedAccount'
            },

            initialize: function(/* options */) {
                this.collection.bind('reset', this.render, this);

                // Subscribe to events
                MessageBus.on('SelectedAccountChanged', function(selectedAccount) {
                    this.$el.val(selectedAccount.id);
                }, this);
            },

            setSelectedAccount: function(event) {
                Repository.setSelectedAccountId(event.target.value);
                return false;
            },

            render: function() {
                // Take out entries that might be sitting in the dropdown
                this.$el.empty();

                // Add new entries from accounts collection. Pass this object as context
                this.collection.each(function(accountModel) {
                    // Format account values for display
                    var account = accountModel.toJSON();  // returns a copy of the model's attributes
                    account.cashPositionFormatted = Formatter.formatMoney(account.cashPosition);

                    // Render using template
                    var hash = {
                        account: account
                    };

                    var template = TemplateManager.getTemplate('account-selector');
                    $(this.el).append(template(hash));

                }, this);

                // Select the selected account
                if (Repository.getSelectedAccount()) {
                    this.$el.val(Repository.getSelectedAccount().id);
                }

                return this;
            }
        });
    }
);