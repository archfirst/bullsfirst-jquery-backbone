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
 * bullsfirst/views/TabbarView
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus'],
       function(Message, MessageBus) {

    return Backbone.View.extend({
        events: {
            'click a': 'handleClick'
        },

        initialize: function() {
            // Subscribe to events
            MessageBus.on(Message.TabSelectionRequest, this.selectTab, this);
        },

        handleClick: function(event) {
            event.preventDefault();
            MessageBus.trigger(
                Message.TabSelectionRequest,
                { tabbar: this.$el.data('tabbar'), tab: $(event.target).data('tab') });
            return false;
        },

        selectTab: function(tabInfo) {
            if (tabInfo.tabbar !== this.$el.data('tabbar'))
                return;

		    this.$el.find('a').each(function() {
                if ($(this).data('tab') === tabInfo.tab) {
                    $(this).addClass("selected");
                }
                else {
			        $(this).removeClass("selected");	
                }
		    });
        }
    });
});