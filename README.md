bullsfirst-jquery-backbone
==========================

This is an implementation of the Bullsfirst front-end using jQuery and Backbone.js. Note that Bullsfirst uses a REST Service hosted at apps.archfirst.org. During development we will use a Node.js based proxy-server to access this REST service.

## Requirements

- Install Node
    - on OSX, install [home brew](http://brew.sh/) and type `brew install node`
    - on Windows, use the installer available at [nodejs.org](http://nodejs.org/)
- Open terminal
- Type `npm install -g grunt-cli`
- Install Ruby (required for Sass)
    - on OSX, Ruby comes pre-installed
    - on Windows, use the instructions [here](http://rubyinstaller.org/downloads/)
- Install Sass and Compass (on OSX you may need to `sudo` these commands)
    - `gem install sass`
    - `gem install compass`

## Quick Start
Clone this repo and run the content locally:
```bash
$ npm install
$ grunt
```
- `npm install` will install the required node libraries under `node_modules`.
- `grunt` will run JSHint and compile the Sass to CSS.

Start the proxy-server by running `npm start`. Now start Bullsfirst by pointing your browser to [http://localhost:8080](http://localhost:8080).

## Task Listing

- `grunt watch`

    Keeps Grunt running and watches for file changes. As soon as a file is changed, Grunt rebuilds the project - ready for you to test!