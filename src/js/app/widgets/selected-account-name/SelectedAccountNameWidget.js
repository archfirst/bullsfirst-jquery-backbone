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
 * app/widgets/selected-account-name/SelectedAccountNameWidget
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'framework/BaseView',
        'framework/MessageBus'
    ],
    function(Message, BaseView, MessageBus) {
        'use strict';

        return BaseView.extend({

            // Constructor options:
            //   el: element where account name should be inserted
            //   model: selectedAccount
            initialize: function() {
                // Subscribe to 'SelectedAccountChanged' event
                this.listenTo(MessageBus, Message.SelectedAccountChanged, function(selectedAccount) {
                    this.model = selectedAccount;
                    this.render();
                });
            },

            render: function() {
                if (this.model) {
                    this.$el.html(this.model.get('name'));
                }

                return this;
            }
        });
    }
);