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
 * app/widgets/position-table/PositionTableWidget
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/widgets/position-table/PositionTableBodyView',
        'backbone',
        'keel/BaseView',
        'keel/MessageBus',
        'text!app/widgets/position-table/PositionTableTemplate.html',
        'jqueryTreeTable'
    ],
    function(Message, Repository, PositionTableBodyView, Backbone, BaseView, MessageBus, PositionTableTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'table',
            className: 'position-table bf-table',
            elements: ['positionTableBody'],

            template: {
                name: 'PositionTableTemplate',
                source: PositionTableTemplate
            },

            // Constructor options:
            //   none required
            initialize: function() {
                // Subscribe to `SelectedAccountChanged` event
                this.listenTo(MessageBus, Message.SelectedAccountChanged, function(selectedAccount) {
                    var tableView = this.children.PositionTableBodyView;
                    tableView.collection = selectedAccount.get('positions');
                    tableView.render();
                    this.$el.treeTable();
                });
            },

            postRender: function() {
                var selectedAccount = Repository.getSelectedAccount();
                this.addChildren([
                    {
                        id: 'PositionTableBodyView',
                        viewClass: PositionTableBodyView,
                        options: {
                            el: this.positionTableBodyElement,
                            collection: selectedAccount ?
                                selectedAccount.get('positions') : new Backbone.Collection()
                        }
                    }
                ]);

                // Display as TreeTable
                this.$el.treeTable();
            }
        });
    }
);