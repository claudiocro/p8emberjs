/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n'+
      ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %>' + "\n" +
      ' <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      ' * ' + "\n" +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>' + "\n" +
      ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' + "\n"+
      ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>' + "\n"+
      ' * ' + "\n" +
      ' * Date: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss o") %>' + "\n" +
      ' */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
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
        browser: true
      },
      globals: {
        jQuery: true,
        Ember:true,
        P8DS:true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('travis', 'lint qunit');
};
