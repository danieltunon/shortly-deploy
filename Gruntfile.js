module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      libs: {
        src: [
          'public/lib/jquery.js', 
          'public/lib/underscore.js',
          'public/lib/handlebars.js',
          'public/lib/backbone.js'
        ],
        dest: 'public/prod/libs-concated.js'
      },
      dist: {
        src: [
          'public/client/*.js'
        ],
        dest: 'public/prod/client-concated.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: {
          except: ['$', 'Handlebars', 'Shortly', 'jQuery', 'Templates', 'Backbone']
        }
      },
      lib: {
        files: {
          'public/prod/libs-min.js': ['public/prod/libs-concated.js'] //'<%= concat.dist.dest =%>'
        }
      },
      client: {
        files: {
          'public/prod/client-min.js': ['public/prod/client-concated.js'] //'<%= concat.dist.dest =%>'
        }
      }
    },

    eslint: {
      target: [
        '*.js',
        '/public/client/*.js'
      ]
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: ' MODE=production node server.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console

    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });



  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'test',
    'eslint',
    'concat',
    'uglify',
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([
        'test',
        'eslint',
        'concat',
        'uglify',
        'shell:prodServer'
      ]);
    } else {
      grunt.task.run([
        'test',
        'eslint',
        'concat',
        'uglify',
        'server-dev'
      ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);


};
