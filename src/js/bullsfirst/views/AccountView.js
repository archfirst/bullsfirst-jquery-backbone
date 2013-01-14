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
define(
    [
        'backbone',
        'app/domain/UserContext',
        'framework/ErrorUtil',
        'app/common/Message',
        'framework/MessageBus',
        'app/services/AccountService',
        'bullsfirst/views/TemplateManager'
    ],
    function(Backbone, UserContext, ErrorUtil, Message, MessageBus, AccountService, TemplateManager) {
        'use strict';

        return Backbone.View.extend({

            tagName: 'tr',

            events: {
                'mouseover': 'handleMouseOverRaw',
                'mouseout': 'handleMouseOutRaw',
                'click': 'handleClickRaw',
                'click .left-column': 'handleClickEditIconRaw', /* click on icon-edit is not detected on chrome */
                'click .icon-save': 'handleClickSaveIconRaw',
                'keydown .nameField': 'handleKeyDownOnNameRaw' /* keypress for Escape is not detected on chrome */
            },

            handleMouseOverRaw: function() {
                MessageBus.trigger(Message.AccountMouseOverRaw, this.model.id);
                return false;
            },

            handleMouseOver: function() {
                this.$el.addClass('selected');
                this.$el.find('.icon-edit').removeClass('invisible');
            },

            handleMouseOutRaw: function() {
                MessageBus.trigger(Message.AccountMouseOutRaw, this.model.id);
                return false;
            },

            handleMouseOut: function() {
                this.$el.removeClass('selected');
                this.$el.find('.icon-edit').addClass('invisible');
            },

            handleClickRaw: function() {
                MessageBus.trigger(Message.AccountClickRaw, this.model.id);
                return false;
            },

            handleClickEditIconRaw: function() {
                MessageBus.trigger(Message.AccountClickEditIconRaw, this.model.id);
                return false;
            },

            handleClickEditIcon: function() {
                this.$el.find('.name').addClass('editing');
                this.$el.find('.nameField').val(this.model.get('name')).focus();
            },

            handleClickSaveIconRaw: function() {
                this.validateInput();
                return false;
            },

            handleKeyDownOnNameRaw: function(event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    this.validateInput();
                    return false;
                }
                else if (event.keyCode === $.ui.keyCode.ESCAPE) {
                    this.stopEditing();
                    return false;
                }

                // If not one of the keycodes above, let the event bubble up for the input box
            },

            validateInput: function() {
                var newName = this.$el.find('.nameField').val();
                if (typeof newName !== 'undefined' && newName !== null && newName.length > 0) {
                    this.stopEditing();

                    // Change name of brokerage account
                    AccountService.changeName(
                        this.model.id, this.$el.find('.nameField').val(), this.changeNameDone, ErrorUtil.showError);
                }
            },

            stopEditing: function() {
                this.$el.find('.name').removeClass('editing');
                MessageBus.trigger(Message.AccountStoppedEditing, this.model.id);
                this.handleMouseOutRaw(); // force deselection of this account in case cursor is on some other account
            },

            changeNameDone: function(/* data, textStatus, jqXHR */) {
                UserContext.updateAccounts();
            },

            render: function() {
                var account = this.model.toJSON();  // returns a copy of the model's attributes
                var template = TemplateManager.getTemplate('account');
                $(this.el).html(template(account));
                return this;
            }
        });
    }
);