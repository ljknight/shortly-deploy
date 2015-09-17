module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/handlebars.js',
          'public/lib/backbone.js'
        ],
        dest: 'public/lib/miniLib.js'
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
      build : {
        src: 'public/lib/miniLib.js',
        dest: 'public/lib/miniLib.min.js'
      }

    },

    jshint: {
      files: [
        'public/client/*.js',
        'server.js',
        'server-config.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
          files: [{
            expand: true,
            cwd: 'public',
            src: ['*.css', '!*.min.css'],
            dest: 'public',
            ext: '.min.css'
          }]
        }
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
      
        // command: ['git add .','git commit -m "deploying again"', 'git push azure master']
        
        gitAdd:{
          command: 'git add .'
        },
        gitCommit:{
          command:'git commit -m "commit bot says COMMIT"'
        }
        // git:{
        //   command: 'git commit -m "autocommit robot commits well"'
        // },
        // git:{
        //   command: 'git push azure master'
        // }

    
          
    },

    deploy: {
      liveservers: {
        options:{
          servers: [{
            host: 'http://shlorian.azurewebsites.net/',
            port: process.env.port,
            username: 'ljknight',
            password: 'laura123'
          }],
          cmds_before_deploy: ["shell"],
          cmds_after_deploy: []
          // deploy_path: 'your deploy path in server'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-forever');
  grunt.loadNpmTasks('grunt-deploy');

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
    'mochaTest','jshint'
  ]);

  grunt.registerTask('build', [
    'concat', 'uglify', 'cssmin', 
  ]);

  grunt.option('prod', true);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      'deploy'
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy2',[
   'upload','default'
  ]);

  grunt.registerTask('default',['shell']);


};
