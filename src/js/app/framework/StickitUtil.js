/**
 * app/framework/StickitUtil
 *
 * Utility functions for Stickit
 *
 * @author Naresh Bhatia
 */
/*jshint camelcase: false */
define(
    [
        'backbone',
        'stickit'
    ],
    function(Backbone) {
        'use strict';

        // ---------------------------------------------------------------
        // Select2 handler
        // ---------------------------------------------------------------
        Backbone.Stickit.addHandler({

            selector: 'select.select2',

            select2Defaults: {
                minimumResultsForSearch: 10
            },

            initialize: function($el, model, options) {

                var changeEvent = 'change:' + options.observe;
                var self = this;

                var settings = $.extend({}, options.select2Defaults, options.select2Options);
                $el.select2(settings);

                var handleModelChange = function(model, value, options) {
                    if (!options.bindKey) {
                        // [Naresh] Verify this comment
                        // 'change' is an event specific to the select2 drop-down asking it to rebuild it
                        $el.trigger('change');
                    }
                };

                this.listenTo(model, changeEvent, handleModelChange);

                this.listenTo(model, 'stickit:unstuck', function() {
                    self.stopListening(model, changeEvent, handleModelChange);
                });
            }
        });
    }
);