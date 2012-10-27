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
        'bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/services/AccountService',
        'bullsfirst/views/TemplateManager'],
       function(UserContext, ErrorUtil, Message, MessageBus, AccountService, TemplateManager) {

    return Backbone.View.extend({

        tagName: 'tr',

        events: {
            'mouseover': 'sendMouseOverMessage',
            'mouseout': 'sendMouseOutMessage',
            'click': 'sendDrillDownkMessage',
            'click .left-column': 'startEditing', /* click on icon-edit is not detected on chrome */
            'click .icon-save': 'validateInput',
            'keydown .nameField': 'handleKeyDown' /* keypress for Escape is not detected on chrome */
        },

        sendMouseOverMessage: function() {
            MessageBus.trigger(Message.AccountListMouseOver, this.model.id);
        },

        sendMouseOutMessage: function() {
            MessageBus.trigger(Message.AccountListMouseOut, this.model.id);
        },

        sendDrillDownkMessage: function() {
            MessageBus.trigger(Message.AccountListDrillDown, this.model.id);
        },

        startEditing: function() {
            this.$el.find('.name').addClass('editing');
            this.$el.find('.nameField').val(this.model.get('name')).focus();
            MessageBus.trigger(Message.AccountListStartEditing, this.model.id);
            return false;
        },

        stopEditing: function() {
            this.$el.find('.name').removeClass('editing');
            MessageBus.trigger(Message.AccountListStopEditing, this.model.id);
            return false;
        },

        handleKeyDown: function(event) {
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
            this.$el.find('.icon-edit').removeClass('invisible');
        },

        handleMouseOut: function() {
            this.$el.removeClass('selected');
            this.$el.find('.icon-edit').addClass('invisible');
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