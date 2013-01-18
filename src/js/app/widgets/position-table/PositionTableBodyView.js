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
 * app/widgets/position-table/PositionTableBodyView
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/common/Message',
        'app/widgets/position-table/PositionView',
        'framework/BaseView',
        'framework/MessageBus'
    ],
    function(Message, PositionView, BaseView, MessageBus) {
        'use strict';

        return BaseView.extend({

            initialize: function() {
                // Subscribe to events
                MessageBus.on(Message.SelectedAccountChanged, function(selectedAccount) {
                    this.collection = selectedAccount.get('positions');
                    this.listenTo(this.collection, 'reset', this.render);
                    this.render();
                }, this);
            },

            render: function() {
                this.destroyChildren();

                this.collection.each(function(position, i) {
                    var positionId = 'position-' + position.get('instrumentSymbol');
                    this.addChild({
                        id: positionId,
                        viewClass: PositionView,
                        parentElement: this.$el,
                        options: {
                            model: position,
                            id: positionId,
                            className: (i % 2) ? '' : 'alt'
                        }
                    });

                    // Add rows for children
                    var children = position.get('children');
                    if (children) {
                        this._renderChildren(children, positionId);
                    }
                }, this);

                // Display as TreeTable
                $('#positions-table').treeTable();

                return this;
            },

            _renderChildren: function(children, positionId) {
                children.each(function(child) {
                    var id = 'lot-' + child.get('lotId');
                    this.addChild({
                        id: id,
                        viewClass: PositionView,
                        parentElement: this.$el,
                        options: {
                            model: child,
                            id: id,
                            className: 'child-of-' + positionId
                        }
                    });
                }, this);
            }
        });
    }
);