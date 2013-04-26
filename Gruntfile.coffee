config =
  dist: 
    min: 'dist/<%= pkg.name %>.min.js'
    src: 'dist/<%= pkg.name %>.js'
  temp: 
    coffee: '.tmp/<%= pkg.name %>.coffee.js'
    all: '.tmp/<%= pkg.name %>.js'
    icons: '.tmp/data_uri.js'
  src: 'src/*.coffee'
  libs: 'src/libs/*.js'
  banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> - <%= pkg.author %>*/\n'

SRC = [config.libs, config.temp.coffee, config.temp.icons]

module.exports = (grunt) ->
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    config: config

    imagemin:
      dist:
        options:
          optimizationLevel: 5
        files: [
          expand: true
          cwd: 'src/favicons/'
          src: ['*.png']
          dest: '.tmp/favicons/'
          ext: '.png'
        ]

    dataUri:
      options:
        target: ['.tmp/favicons/*.*']
        fixDirLevel: true
        baseDir: './'
      
      dist:
        src: 'src/data_uri.js'
        dest: '.tmp'


    uglify:
      options:
        banner: config.banner

      dist:
        src: SRC
        dest: config.dist.min


    coffee:
      temp:
        src: config.src
        dest: config.temp.coffee

    concat:
      options:
        banner: config.banner
      
      temp:
        src: SRC
        dest: config.temp.all

      dist:
        src: SRC
        dest: config.dist.src

  grunt.registerTask 'build', ['coffee:temp', 'imagemin', 'dataUri', 'concat:temp']
  grunt.registerTask 'dist', ['build', 'uglify', 'concat:dist']