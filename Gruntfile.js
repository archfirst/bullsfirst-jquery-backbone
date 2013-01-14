module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // ### clean
    // grunt-contrib-clean npm task
    // Deletes the <string> paths in the array
    clean: {
      clean: ['src/css', 'dist']
    },

    // ### compass
    // grunt-contrib-compass npm task
    compass: {
      dev: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'src/css',
          imagesDir: 'src/img',
          javascriptsDir: 'src/js',
          noLineComments: true,
          environment: 'development'
        }
      },
      dist: {
        options: {
          sassDir: 'dist/sass',
          cssDir: 'dist/css',
          imagesDir: 'dist/img',
          javascriptsDir: 'dist/js',
          noLineComments: true,
          environment: 'production'
        }
      }
    },

    // ### copy
    // grunt-contrib-copy npm task
    copy: {
      cssImages: {
        files: {
          'src/css/images/': ['src/sass/images/*']
        }
      }
    },

    // ### jshint
    // JSHint options for the lint task
    jshint: {
      all: ['src/js/main.js', 'src/js/app/**/*.js', 'src/js/framework/**/*.js'],
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
        plusplus      : false,
        quotmark      : 'single',
        regexp        : true,
        undef         : true,
        unused        : true,
        strict        : true,
        trailing      : true,
        maxparams     : 20,
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
          define: true,
          require: true,
          Modernizr: true
        }
      }
    },

    // ### watch
    // Executes the listed targets on file save
    watch: {
      jshint: {
        files: '<%= jshint.all %>',
        tasks: ['jshint'],
        options: {
          interrupt: true
        }
      },
      compass: {
        files: 'src/sass/*',
        tasks: ['compass:dev'],
        options: {
          interrupt: true
        }
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['clean', 'jshint', 'compass:dev', 'copy:cssImages']);
};