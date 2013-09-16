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
 * app/framework/ValidationUtil
 *
 * Utility functions for backbone-validation
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone',
        'underscore',
        'qtip',
        'validation'
    ],
    function(Backbone, _) {
        'use strict';

        // Force update the model even if the values are invalid.
        // This allows the view and the model to remain in sync.
        Backbone.Validation.configure({
            forceUpdate: true
        });

        _.extend(Backbone.Validation.patterns, {

            // Matches letters including spaces
            lettersOnly: /^[a-zA-Z\ \']+$/,

            // Matches ISO 8601 dates, e.g. 2013-01-01
            isoDate: /\d{4}-\d{2}-\d{2}/
        });

        _.extend(Backbone.Validation.callbacks, {

            valid: function(view, attr, selector) {
                // console.log('valid: ' + attr + ', ' + selector);

                selector = (selector === 'id' ?
                            '#' + attr :
                            '[' + selector + '=' + attr + ']');
                var control = view.$(selector);

                control.qtip('destroy', true);
            },

            invalid: function(view, attr, error, selector) {
                // console.log('invalid: ' + attr + ', ' + error + ', ' + selector);

                selector = (selector === 'id' ?
                            '#' + attr :
                            '[' + selector + '=' + attr + ']');
                var control = view.$(selector);

                control.qtip('destroy', true);
                control.qtip({
                    content: error,
                    show: true,
                    hide: {
                        event: false
                    },
                    position: {
                        my: 'bottom left',     // position my bottom left...
                        at: 'top right',       // at the topright of the control
                        adjust: {
                            x: -15
                        }
                    },
                    style: {
                        classes: 'validation-error',
                        tip: {
                            offset: 10,
                            mimic: 'center'
                        }
                    }
                });
            }

        });
    }
);