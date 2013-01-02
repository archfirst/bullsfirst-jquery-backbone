module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // ### jshint
    // JSHint options for the lint task
    jshint: {
      all: ["js/main.js", "js/bullsfirst/**/*.js"],
      options: {
        // Enforcing Options
        bitwise       : true,
        camelcase     : true,
        curly         : true,
        eqeqeq        : true,
        forin         : true,
        immed         : true,
        indent        : 4,
        latedef       : true,
        newcap        : true,
        noarg         : true,
        noempty       : true,
        nonew         : true,
        plusplus      : true,
        quotmark      : "single",
        regexp        : true,
        undef         : true,
        unused        : true,
        strict        : true,
        trailing      : true,
        maxparams     : 10,
        maxdepth      : 2,
        maxstatements : 30,
        maxcomplexity : 10,
        maxlen        : 150,

        // Relaxing Options
        asi           : false,
        boss          : false,
        debug         : false,
        eqnull        : false,
        es5           : false,
        esnext        : false,
        evil          : false,
        expr          : false,
        funcscope     : false,
        globalstrict  : false,
        iterator      : false,
        lastsemic     : false,
        laxbreak      : false,
        laxcomma      : false,
        loopfunc      : false,
        multistr      : false,
        onecase       : false,
        proto         : false,
        regexdash     : false,
        scripturl     : false,
        smarttabs     : false,
        shadow        : false,
        sub           : false,
        supernew      : false,
        validthis     : false,

        // Environments
        browser       : true,
        couch         : false,
        devel         : false,
        dojo          : false,
        jquery        : true,
        mootools      : false,
        node          : false,
        nonstandard   : false,
        prototypejs   : false,
        rhino         : false,
        worker        : false,
        wsh           : false,
        yui           : false,

        // Legacy
        nomen         : false,
        onevar        : false,
        passfail      : false,
        white         : false,

        globals: {
          _: true,
          define: true,
          require: true,
          base64_encode: true,
          Backbone: true,
          Handlebars: true,
          Highcharts: true,
          Modernizr: true
        }
      }
    }
  });

  // Load the plugin that provides the "lint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint']);
};