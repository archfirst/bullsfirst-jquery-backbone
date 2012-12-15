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
 * bullsfirst/framework/Page
 *
 * @author Naresh Bhatia
 */
define(function() {
    'use strict';

    return Backbone.View.extend({
        hide: function() {
            if (!this.isVisible()) {
                return null;
            }
            var deferred = $.Deferred(_.bind(function(dfd) {
                    this.$el.fadeOut('fast', dfd.resolve);
                }, this));
            return deferred.promise();
        },

        show: function() {
            if (this.isVisible()) {
                return null;
            }
            var deferred = $.Deferred(_.bind(function(dfd) {
                    this.$el.fadeIn('fast', dfd.resolve);
                }, this));
            return deferred.promise();
        },

        // From jQuery :visible Selector docs (note especially that elements with
        // visibility: hidden are considered visible. That's why we can't use
        // h5bp .hidden class to hide pages):
        //
        // Description: Selects all elements that are visible.
        // Elements are considered visible if they consume space in the document.
        // Visible elements have a width or height that is greater than zero.
        // Elements with visibility: hidden or opacity: 0 are considered visible,
        // since they still consume space in the layout. During animations that
        // hide an element, the element is considered to be visible until the end
        // of the animation. During animations to show an element, the element is
        // considered to be visible at the start at the animation.
        isVisible: function() {
            return this.$el.is(':visible');
        }
    });
});