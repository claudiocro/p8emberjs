/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
        banner: '/*!\n'+
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %>' + "\n" +
        ' <%= pkg.homepage ? "* " + pkg.homepage ' + "\n" + ' : "" %>' +
        ' * ' + "\n" +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>' + "\n" +
        ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' + "\n"+
        ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>' + "\n"+
        ' * ' + "\n" +
        ' * Date: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss o") %>' + "\n" +
        ' */'
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        banner: '<%= meta.banner %>',
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        preserveComments: "some"
      },
      dist: {
        files: {
            'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/*.html']
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    
    jshint: {
      dist: {
        src: [ 'Gruntfile.js', 'src/**/*.js', 'test/**/*.js' ],
        options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
        jQuery: true,
        Ember:true,
        P8DS:true
        }
        }
      
     }
        
      
    }
  });
  
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat' ,'uglify']);
  grunt.registerTask('travis', ['jshint', 'qunit']);
};
