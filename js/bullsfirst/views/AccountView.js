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
 * bullsfirst/views/AccountView
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/framework/MessageBus',
        'bullsfirst/views/TemplateManager'],
       function(MessageBus, TemplateManager) {

    return Backbone.View.extend({

        tagName: 'tr',

        events: {
            'mouseover': 'sendMouseOverMessage',
            'mouseout': 'sendMouseOutMessage',
            'click': 'sendClickMessage'
        },

        sendMouseOverMessage: function() {
            MessageBus.trigger('AccountList:mouseover', this.model.id);
        },

        sendMouseOutMessage: function() {
            MessageBus.trigger('AccountList:mouseout', this.model.id);
        },

        sendClickMessage: function() {
            MessageBus.trigger('AccountList:click', this.model.id);
        },

        handleMouseOver: function() {
            this.$el.addClass('selected');
        },

        handleMouseOut: function() {
            this.$el.removeClass('selected');
        },

        handleClick: function() {
            console.log('AccountView.handleClick: ' + this.model.id);
        },

        render: function() {
            var account = this.model.toJSON();  // returns a copy of the model's attributes
            var template = TemplateManager.getTemplate('account');
            $(this.el).html(template(account));
            return this;
        }
    });
});