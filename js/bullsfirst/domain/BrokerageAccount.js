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
 * bullsfirst/domain/BrokerageAccount
 *
 * Attributes:
 *   id: int
 *   name: String
 *   marketValue: Money
 *   cashPosition: Money
 *   editPermission: boolean
 *   tradePermission: boolean
 *   transferPermission: boolean
 *   positions: [Position]
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/domain/Position',
        'bullsfirst/domain/Positions'],
       function(Position, Positions) {

    return Backbone.Model.extend({

        // Parse positions into a backbone collection
        parse: function(response) {
            response.positions = this.positionArrayToCollection(response.positions);
            return response;
        },

        positionArrayToCollection: function(positionArray) {

            var positionCollection = new Positions();

            positionArray.forEach(function(rawPosition) {
                if (typeof rawPosition.children !== 'undefined') {
                    rawPosition.children = this.positionArrayToCollection(rawPosition.children);
                };
                positionCollection.add(new Position(rawPosition));
            }, this);

            return positionCollection;
        }
    });
});