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
            'click': 'sendDrillDownkMessage',
            'click .icon-edit': 'handleEditClick',
            'click .icon-save': 'saveName',
            'keypress .edit':	'saveNameOnEnter',
            'blur .edit': 'stopEditing'
        },

        sendMouseOverMessage: function() {
            MessageBus.trigger('AccountList:mouseover', this.model.id);
        },

        sendMouseOutMessage: function() {
            MessageBus.trigger('AccountList:mouseout', this.model.id);
        },

        sendDrillDownkMessage: function() {
            MessageBus.trigger('AccountList:drillDown', this.model.id);
        },

        handleEditClick: function() {
            this.$el.find('.name').addClass('editing');
            this.$el.find('input').focus();
            MessageBus.trigger('AccountList:editingAccount', this.model.id);
            return false;
        },

        saveName: function() {
            console.log('Save name');
            this.stopEditing();
        },

        saveNameOnEnter: function(e) {
            if (e.which === ENTER_KEY) {
                this.saveName();
            }
        },

        stopEditing: function() {
            this.$el.find('.name').removeClass('editing');
        },

        handleMouseOver: function() {
            this.$el.addClass('selected');
            this.$el.find('.left-column').removeClass('invisible');
        },

        handleMouseOut: function() {
            this.$el.removeClass('selected');
            this.$el.find('.left-column').addClass('invisible');
        },

        handleDrillDown: function() {
            console.log('AccountView.handleDrillDown: ' + this.model.id);
        },

        render: function() {
            var account = this.model.toJSON();  // returns a copy of the model's attributes
            var template = TemplateManager.getTemplate('account');
            $(this.el).html(template(account));
            return this;
        }
    });
});