/*
* File:        jquery.alerts.js
* Author:      Dennis White 
*/

(function($) {
    if ($.ui) {
        $.prompt = function(message, options) {
            var defaultOptions = {
                title: 'Prompt',
                icon: 'help', // just using the jquery ui icons
                defaultResult: '',
                buttons: {
                    "Ok": function() { $(this).dialog("close"); },
                    Cancel: function() { $(this).dialog("close"); }
                }
            };

            if (options)
                defaultOptions = $.extend(defaultOptions, options);

            var $dialog = $('#promptDialog');
            $dialog.remove();

            $dialog = $("<div id='promptDialog' style='display:hidden' title='" + defaultOptions.title + "'></div>").appendTo('body');

            $('#promptMessage').remove();
            $("<p id='promptMessage'><span class='ui-icon ui-icon-" + defaultOptions.icon + "' style='float:left; margin:5px 10px 20px 0;'></span>" + message + "</p>").appendTo('#promptDialog');
            $('<hr />').appendTo('#promptMessage');
            $("<input id='result' type='textbox' style='width:100%' value='" + defaultOptions.defaultResult + "' />").appendTo('#promptMessage');

            $dialog.dialog({
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: true,
                buttons: defaultOptions.buttons
            });
        }

        $.confirm = function(message, options) {
            var defaultOptions = {
                title: 'Confirm',
                icon: 'help', // just using the jquery ui icons
                buttons: {
                    "Yes": function() { $(this).dialog("close"); },
                    "No": function() { $(this).dialog("close"); },
                    Cancel: function() { $(this).dialog("close"); }
                }
            };

            if (options)
                defaultOptions = $.extend(defaultOptions, options);

            var $dialog = $('#confirmDialog');
            $dialog.remove();

            $dialog = $("<div id='confirmDialog' style='display:hidden' title='" + defaultOptions.title + "'></div>").appendTo('body');

            $('#confirmMessage').remove();
            $("<p id='confirmMessage'><span class='ui-icon ui-icon-" + defaultOptions.icon + "' style='float:left; margin:5px 10px 20px 0;'></span>" + message + "</p>").appendTo('#confirmDialog');

            $dialog.dialog({
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: true,
                buttons: defaultOptions.buttons
            });
        }

        $.alert = function(message, options) {
            var defaultOptions = {
                title: 'Alert',
                icon: 'alert', // just using the jquery ui icons
                exception: '',
                stack: '',
                buttons: { "Ok": function() { $(this).dialog("close"); } }
            };

            if (options) {
                defaultOptions = $.extend(defaultOptions, options);
            }

            var dlgWidth = 'auto';

            var $dialog = $('#alertDialog');
            $dialog.remove();

            $dialog = $("<div id='alertDialog' style='display:hidden' title='" + defaultOptions.title + "'></div>").appendTo('body');

            $('#alertMessage').remove();
            $("<p id='alertMessage'><span class='ui-icon ui-icon-" + defaultOptions.icon + "' style='float:left; margin:5px 10px 20px 0;'></span>" + message + "</p>").appendTo('#alertDialog');

            $('#alertException').remove();
            if (defaultOptions.exception != '') {
                if ('' != defaultOptions.stack) {
                    $("<div id='alertException'><hr /></div>").appendTo('#alertDialog');
                    $("<p ><strong>" + defaultOptions.exception + "</strong> " + defaultOptions.stack + "</p>").appendTo('#alertException');
                    // stack traces can be BIG so set the max width
                    dlgWidth = '960';
                }
                else {
                    $("<div id='alertException'></div>").appendTo('#alertDialog');
                    $("<p >" + defaultOptions.exception + "</p>").appendTo('#alertException');
                }
            }

            $dialog.dialog({
                resizable: false,
                height: 'auto',
                width: dlgWidth,
                modal: true,
                buttons: defaultOptions.buttons
            });
        }
    }
})(jQuery);