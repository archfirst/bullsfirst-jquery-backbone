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
 * bullsfirst/framework/BackboneViewExtension
 *
 * Extends Backbone.View to clean up bindings when the view is closed.
 * See http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
 *
 * @author Naresh Bhatia
 */
define(function() {

    Backbone.View.prototype.close = function() {
        // Remove DOM element associated with this view and clean up associated events
        this.remove();

        // Unbind callbacks bound to this view
        this.unbind();

        // Allow view to unbind callbacks bound to other objects (e.g. the model)
        if (this.onClose){
            this.onClose();
        }
    }

});