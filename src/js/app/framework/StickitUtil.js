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
        // Datepicker handler
        // ---------------------------------------------------------------
        Backbone.Stickit.addHandler({

            selector: '.datepicker',

            datetpickerDefaults: {
            },

            initialize: function ($el, model, options) {
                var settings = $.extend({}, options.datetpickerDefaults, options.datetpickerOptions);
                $el.datepicker(settings);
            },

            // Convert from view to model: mm/dd/yy to yy-mm-dd
            getVal: function($el /*, event, options */) {

                var result;
                var dateStr = $el.val();

                if (dateStr === '') {
                    result = '';
                }
                else {
                    var dateParts = dateStr.split('/');
                    result = dateParts[2] + '-' + dateParts[0] + '-' + dateParts[1];
                }

                return result;
            },

            // Convert from model to view: yy-mm-dd to mm/dd/yy
            update: function($el, event, model, options) {

                var result;
                var dateStr = model.get(options.observe);

                if (dateStr === '') {
                    result = '';
                }
                else {
                    var dateParts = dateStr.split('-');
                    result = dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0];
                }

                $el.val(result);
            }
        });

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

        // ---------------------------------------------------------------
        // Bullsfirst checkbox handler
        // ---------------------------------------------------------------
        Backbone.Stickit.addHandler({

            selector: '.bf-checkbox',

            updateModel: false,
            updateView: false,

            initialize: function($el, model, options) {

                var updateView = function(checked) {
                    return checked ? $el.addClass('checked') : $el.removeClass('checked');
                };

                var toggle = function() {
                    var newValue = !$el.hasClass('checked');
                    model.set(options.observe, newValue);
                    return false;
                };

                updateView(model.get(options.observe));

                $el.click(toggle);

                $el.keypress(function(event) {
                    if (event.which === 32) { // Space
                        toggle();
                    }
                });

                return this.listenTo(model, 'change:' + options.observe, function(model, value) {
                    return updateView(value);
                });
            }
        });

        // ---------------------------------------------------------------
        // Bullsfirst radio button handler
        // ---------------------------------------------------------------
        Backbone.Stickit.addHandler({

            selector: '.bf-radio',

            updateModel: false,
            updateView: false,

            initialize: function($el, model, options) {

                var updateView = function(value) {
                    $el.removeClass('checked');
                    $el.filter('[data-value=' + value + ']').addClass('checked');
                };

                var handleClick = function(event) {
                    var value = $(event.target).data('value');
                    model.set(options.observe, value);
                    return false;
                };

                updateView(model.get(options.observe));

                $el.click(handleClick);

                return this.listenTo(model, 'change:' + options.observe, function(model, value) {
                    return updateView(value);
                });
            }
        });
    }
);