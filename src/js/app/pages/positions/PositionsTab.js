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
 * app/pages/positions/PositionsTab
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/Repository',
        'app/widgets/account-selector/AccountSelectorWidget',
        'app/widgets/position-table/PositionTableWidget',
        'app/widgets/selected-account-name/SelectedAccountNameWidget',
        'framework/BaseView',
        'text!app/pages/positions/PositionsTabTemplate.html'
    ],
    function(Repository, AccountSelectorWidget, PositionTableWidget, SelectedAccountNameWidget, BaseView, PositionsTabTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            className: 'positions-tab tab clearfix',
            elements: ['selectedAccountName', 'accountSelector'],

            template: {
                name: 'PositionsTabTemplate',
                source: PositionsTabTemplate
            },

            events: {
                'click .js-refreshButton': 'refreshAccounts'
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'AccountSelectorWidget',
                        viewClass: AccountSelectorWidget,
                        options: {
                            el: this.accountSelectorElement,
                            collection: Repository.getBrokerageAccounts()
                        }
                    },
                    {
                        id: 'SelectedAccountNameWidget',
                        viewClass: SelectedAccountNameWidget,
                        options: {
                            el: this.selectedAccountNameElement,
                            model: Repository.getSelectedAccount()
                        }
                    },
                    {
                        id: 'PositionTableWidget',
                        viewClass: PositionTableWidget,
                        parentElement: this.$el
                    }
                ]);
            },

            refreshAccounts: function() {
                Repository.updateAccounts();
                return false;
            }
        });
    }
);