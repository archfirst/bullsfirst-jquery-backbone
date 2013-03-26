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
 * app/widgets/filter/FilterWidget
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/Repository',
        'keel/BaseView',
        'underscore',
        'jqueryselectbox'
    ],

    function( Repository, BaseView, _ ) {
        'use strict';


        return BaseView.extend({

			tagName: 'div',

            setFilters: function( formElement, _filterCriteria ){

                _.each(_filterCriteria, function( value, prop ) {
                    //
                    var _element = formElement.find('[name="'+prop+'"]');
                    //
                    if (value && _element.hasClass('datepicker')) {
                        if (!_element.datepicker()){
                            _element.datepicker();
                        }
                        _element.datepicker('setDate', this._parseDate(value));
                    }
                    else if ( _element.is('select') ) {
                        //detach the selectbox from UI
                        _element.selectbox('detach');
                        // set the value to select tag
                        _element.val(value);
                        // again attach the select box to populate on set value of select tag
                        _element.selectbox('attach');
                    }
                    // check for tags with type checkbox and name is prop[]
                    else if ( formElement.find('input[name="'+prop+'[]"]').is(':checkbox')) {
                        var valuearr = value.split(',');
                        formElement.find('input[name="'+prop+'[]"]').val(valuearr);
                    }
                    else {
                        _element.prop( 'value', value );
                    }
                },this);
            },
            _parseDate: function ( _date ) {
                //extract all the digits from _date which is in format YYYY-MM-DD
                var parts = _date.match(/(\d+)/g);
                return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
            }

        });
    }
);