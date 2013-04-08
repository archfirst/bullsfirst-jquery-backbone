/*!
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
* app/framework/AppRouter
*
* Extends the Keel Router to route to different pages in the application.
*
* @module AppRouter
* @requires Router
* @author Bob Holt
*/
define([

    'keel/Router'

],

function(Router) {
    'use strict';

    /**
    * Defining the application router, you can attach sub routers here.
    *
    * @class AppRouter
    * @constructor
    * @extends Router
    **/
    var AppRouter = Router.extend();

    return AppRouter;
});