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
define(['bullsfirst/domain/UserContext',
        'bullsfirst/framework/ErrorUtil',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/services/AccountService',
        'bullsfirst/views/TemplateManager'],
       function(UserContext, ErrorUtil, MessageBus, AccountService, TemplateManager) {

    return Backbone.View.extend({

        tagName: 'tr',

        events: {
            'mouseover': 'sendMouseOverMessage',
            'mouseout': 'sendMouseOutMessage',
            'click': 'sendDrillDownkMessage',
            'click .icon-edit': 'startEditing',
            'click .icon-save': 'validateInput',
            'keypress .edit': 'handleKeyPress',
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

        startEditing: function() {
            this.$el.find('.name').addClass('editing');
            this.$el.find('.nameField').val(this.model.get('name')).focus();
            MessageBus.trigger('AccountList:startEditing', this.model.id);
            return false;
        },

        stopEditing: function() {
            this.$el.find('.name').removeClass('editing');
            MessageBus.trigger('AccountList:stopEditing', this.model.id);
            return false;
        },

        handleKeyPress: function(event) {
            if (event.keyCode == $.ui.keyCode.ENTER) {
                this.validateInput();
                return false;
            }
            else if (event.keyCode == $.ui.keyCode.ESCAPE) {
                this.stopEditing();
                return false;
            }
        },

        validateInput: function() {
            var newName = this.$el.find('.nameField').val();
            if (typeof newName !== 'undefined' && newName != null && newName.length > 0) {
                this.stopEditing();

                // Change name of brokerage account
                AccountService.changeName(
                    this.model.id, this.$el.find('.nameField').val(), this.changeNameDone, ErrorUtil.showError);
            }
        },

        changeNameDone: function(data, textStatus, jqXHR) {
            UserContext.updateAccounts();
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