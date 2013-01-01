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
 * bullsfirst/views/AccountFilterView
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/domain/UserContext',
        'text!bullsfirst/templates/account-filter.tpl'],
       function(UserContext, accountFilterTemplate) {

    return Backbone.View.extend({

        initialize: function(options) {
            this.collection.bind('reset', this.render, this);
        },

        render: function() {
            // Take out entries that might be sitting in the dropdown
            this.$el.empty();

            // Add placeholder entry
            this.$el.append('<option value="">All Accounts</option>');

            // Add new entries from accounts collection. Pass this object as context
            this.collection.each(function(accountModel, i) {
                // Format account values for display 
                var account = accountModel.toJSON()  // returns a copy of the model's attributes

                // Render using template
                var hash = {
                    account: account
                }
                this.$el.append(Mustache.to_html(accountFilterTemplate, hash));
            }, this);

            return this;
        }
    });
});