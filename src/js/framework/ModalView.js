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
 * framework/ModalView
 *
 * Base view for creating modal dialogs.
 *
 * Derived classes can initialize a settings property to control the
 * behavior of the modal dialog:
 *
 *   settings.draggable: boolean - allows the user to drag the dialog box
 *   settings.centerInWindow : boolean - center the dialog in the window
 *   settings.style: string - adds the specified style to the dialog
 *   settings.overlay: boolean - creates an overlay on the entire window
 *
 * @author Alasdair Swan
 */
define(
    [
        'framework/BaseView',
        'framework/ModalOverlayView',
        'jqueryui'
    ],
    function(BaseView, ModalOverlayView) {
        'use strict';

        return BaseView.extend({
            tagName: 'div',

            centerInWindow: function() {
                var top = ($(window).height() - this.$el.height()) / 2;
                var left = ($(window).width() - this.$el.width()) / 2;

                this.$el.css({
                    top: top,
                    left: left
                });
            },

            close: function(e) {
                if (e) {
                    e.preventDefault();
                }

                this.destroy();
            },

            postPlace: function() {
                if (this.settings.draggable === true) {
                    this.$el.draggable();
                }

                if (this.settings.centerInWindow === true) {
                    this.centerInWindow();
                }
            },

            postRender: function() {
                if (this.settings.style) {
                    this.$el.addClass(this.settings.style);
                }

                if (this.settings.overlay === true) {
                    this.addChild({
                        id: 'ModalOverlayView',
                        viewClass: ModalOverlayView,
                        parentElement: $('body')
                    });
                }

                var modalView = this;
                $(window).on('keyup', function(e) {
                    if (e.which === 27) { // Escape
                        modalView.close();
                    }
                });
            }
        });
    }
);