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
 * bullsfirst/views/UserPage
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/framework/MessageBus',
        'bullsfirst/framework/Page',
        'bullsfirst/views/AccountsTabView',
        'bullsfirst/views/OrdersTabView',
        'bullsfirst/views/PositionsTabView',
        'bullsfirst/views/TabbarView',
        'bullsfirst/views/TransactionsTabView'],
       function(MessageBus, Page, AccountsTabView, OrdersTabView, PositionsTabView, TabbarView, TransactionsTabView) {

    return Page.extend({
        el: '#user-page',

        events: {
            'click #sign-out': 'logout',
            'click #trade-button': 'trade',
            'click #transfer-button': 'transfer'
        },

        initialize: function() {
            new TabbarView({el: '#user-page .tabbar'});
            new AccountsTabView();
            new PositionsTabView();
            new OrdersTabView();
            new TransactionsTabView();
        },

        logout: function() {
            MessageBus.trigger('UserLoggedOutEvent');
            return false;
        },

        trade: function() {
            alert('Trade');
            return false;
        },

        transfer: function() {
            alert('Transfer');
            return false;
        },

        selectTab: function(tab) {
		    this.$el.find('.tab').each(function() {
                if (this.id === tab) {
                    $(this).removeClass('nodisplay');
                }
                else {
			        $(this).addClass('nodisplay');	
                }
		    });
        }
    });
});