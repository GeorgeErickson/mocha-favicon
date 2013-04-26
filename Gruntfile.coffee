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

SRC = [config.libs, config.temp.coffee]

module.exports = (grunt) ->
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    config: config

    clean:
      temp: '.tmp'
      dist: 'dist'

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
        src: config.src
        dest: '.tmp'


    uglify:
      options:
        banner: config.banner

      dist:
        src: SRC
        dest: config.dist.min


    coffee:
      temp:
        src: '.tmp/mocha-favicon.coffee'
        dest: config.temp.coffee

    copy:
      temp:
        src: 'index.html'
        dest: '.tmp/index.html'
      dist:
        src: 'index.html'
        dest: 'dist/index.html'

    concat:
      options:
        banner: config.banner
      
      temp:
        src: SRC
        dest: config.temp.all

      dist:
        src: SRC
        dest: config.dist.src

    regarde:
      app:
        files: 'src/**/*'
        tasks: ['build']
      dist:
        files: 'src/**/*'
        tasks: ['dist']

    connect:
      temp:
        options:
          port: 9000
          base: '.tmp'
      dist:
        options:
          port: 9000
          base: 'dist'

  grunt.registerTask 'build', ['clean:temp', 'imagemin', 'dataUri', 'coffee:temp', 'concat:temp', 'copy:temp']
  grunt.registerTask 'watch', ['build', 'connect:temp', 'regarde:app']
  grunt.registerTask 'dist', ['clean:dist','build', 'uglify', 'concat:dist', 'copy:dist']
  grunt.registerTask 'watch:dist', ['build', 'connect:dist', 'regarde:dist']