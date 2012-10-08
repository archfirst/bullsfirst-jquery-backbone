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
 * bullsfirst/views/AccountTableView
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/views/AccountView'],
       function(AccountView) {

    return Backbone.View.extend({

        el: '#account-table tbody',

        initialize: function(options) {
            this.collection.bind('reset', this.render, this);
        },

        render: function() {
            // take out rows that might be sitting in the table
            this.$el.empty();

            // Add new rows from accounts collection. Pass this object as context
            this.collection.each(function(account, i) {
                var view = new AccountView({model: account});
                view.render().$el.find('.legend').addClass('color-' + (i%10));
                this.$el.append(view.el);
            }, this);

            return this;
        }
    });
});