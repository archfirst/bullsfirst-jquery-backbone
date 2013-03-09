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
 * app/widgets/modal/ModalWidget
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/common/Message',
        'app/domain/Repository',
        'app/widgets/modal/ModalOverlayView',
        'backbone',
        'framework/BaseView',
        'framework/MessageBus',
        'text!app/widgets/modal/ModalTemplate.html'
    ],
    function(Message, Repository, ModalOverlayView, Backbone, BaseView, MessageBus, ModalTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',

            events: {
                'click .modal-close' : 'closeModal'
            },

            template: {
                name: 'ModalTemplate',
                source: ModalTemplate
            },

            applySettings: function(settings){
                if ( $('.modal-overlay').css('display') === 'none' ) {
                    $('.modal-overlay').show();
                }

                if (settings.overlay) {
                    $('.modal-overlay').addClass('show');
                }

                if (settings.style) {
                    $('#' + settings.id).addClass(settings.style);
                }

                if (settings.draggable) {
                    $('#' + settings.id).draggable();
                }

            },

            centerModal: function() {

                var top = ($(window).height() - this.$el.height()) / 2;
                var left = ($(window).width() - this.$el.width()) / 2;

                this.$el.css({
                    top: top,
                    left: left
                });

            },

            closeModal: function(e) {
                if (e) {
                    e.preventDefault();
                }

                this.destroy();
                this.updateModal('.modal-overlay');
            },

            postPlace: function() {
                this._postPlace();
            },

            _postPlace: function() {
                if (this.settings.position === 'center') {
                    this.centerModal();
                }
            },

            postRender: function(settings) {
                this._postRender(settings);
            },

            _postRender: function(settings) {

                if (settings.overlay) {
                    this.addChildren([{
                        id: 'ModalOverlayView',
                        viewClass: ModalOverlayView,
                        parentElement: $('body')
                    }]);
                }

            },

            render: function() {

                var template = this.getTemplate(),
                    settings = this.settings,
                    applySettings = this.applySettings,
                    modalView = this;

                // Destroy existing children
                this.destroyChildren();

                this.$el.html(template(settings));
                this._setupElements();

                // Subscribe to events
                this.listenTo(MessageBus, Message.ModalLoad, function(){
                    applySettings(settings);
                });

                $(window).on('keyup', function(e) {
                    if (e.which === 27) { // Escape
                        modalView.closeModal();
                    }
                });

                this.postRender(settings);

                return this;
            },

            updateModal: function(modal) {
                if ( ! $(modal).hasClass('stacked') ) {
                    $(modal).hide();
                }
                else {
                    $(modal).removeClass('stacked show');
                }
            }
        });
    }
);