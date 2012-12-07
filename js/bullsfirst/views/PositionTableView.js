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
 * bullsfirst/views/PositionsTableView
 *
 * @author Naresh Bhatia
 */


define(['bullsfirst/framework/MessageBus',
        'bullsfirst/views/PositionView'],
	   	function(MessageBus, PositionView) {

   	return Backbone.View.extend({

   		el: '#positions-table tbody',

	  	initialize: function(options) {
            //this.collection.bind('reset', this.render, this);
            MessageBus.on('SelectedAccountChanged', function(selectedAccount) {
                this.collection = selectedAccount.get('positions');
                this.collection.bind('reset', this.render, this);
                this.render();
            }, this);
		},

		render: function() {
			this.$el.empty();
			this.collection.each(function(position, i) {
                var positionId = 'position-' + position.get('instrumentSymbol');
                var view = new PositionView({
                    model: position,
                    id: positionId,
                    className: (i % 2) ? "" : "alt"
                });
                this.$el.append(view.render().el);

                // Add rows for children
                var children = position.get('children');
                if (children) {
                    this._renderChildren(children, positionId);
                }
            }, this);

            // Display as TreeTable
            //$("#positions-table").treeTable();

            return this;
		},

		_renderChildren: function(children, positionId) {
            children.each(function(child, i) {
                var view = new PositionView({
                    model: child,
                    id: 'lot-' + child.get('lotId'),
                    className: 'child-of-' + positionId
                });
                this.$el.append(view.render().el);
            }, this);
        }

   	});
 });