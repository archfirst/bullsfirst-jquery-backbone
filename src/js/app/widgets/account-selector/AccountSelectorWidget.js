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
 * app/widgets/account-selector/AccountSelectorWidget
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'framework/BaseView',
        'framework/Formatter',
        'framework/MessageBus',
        'text!app/widgets/account-selector/AccountSelectorTemplate.html'
    ],
    function(Message, Repository, BaseView, Formatter, MessageBus, AccountSelectorTemplate) {
        'use strict';

        return BaseView.extend({

            template: {
                name: 'AccountSelectorTemplate',
                source: AccountSelectorTemplate
            },

            events: {
                'change': 'setSelectedAccount'
            },

            initialize: function() {
                this.collection.bind('reset', this.render, this);

                // Subscribe to events
                MessageBus.on(Message.SelectedAccountChanged, function(selectedAccount) {
                    this.$el.val(selectedAccount.id);
                }, this);
            },

            setSelectedAccount: function(event) {
                Repository.setSelectedAccountId(event.target.value);
                return false;
            },

            render: function() {
                // Destroy existing children
                this.destroyChildren();

                // Add new entries from accounts collection. Pass this object as context
                this.collection.each(function(model) {

                    var template = this.getTemplate();
                    var context = model.toJSON();
                    
                    this.$el.append(template(context));
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