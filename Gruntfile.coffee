'use strict'

# Constants
MODULES_DIR      = 'modules'
BUILD_DIR        = 'build'
DIST_DIR         = 'dist'
VENDOR_FILES     = 'lib/*/index.js'

module.exports = (grunt) ->

  grunt.initConfig
    bower:
      install:
        cleanup: yes
        copy: no

    clean:
      build: [BUILD_DIR]
      dist: [DIST_DIR]

    coffee:
      dist:
        options:
          sourceMap: yes
          join: yes
        src: [
          "#{MODULES_DIR}/bradypodion.coffee"
          "#{MODULES_DIR}/*/*/*.coffee"
        ]
        dest: "#{DIST_DIR}/bradypodion.js"
      tests:
        options: join: yes
        src: ["#{MODULES_DIR}/*/*/test/*.coffee"]
        dest: "#{BUILD_DIR}/tests.js"

    coffeelint:
      options:
        newlines_after_classes:
          level: 'error'
        no_empty_param_list:
          level: 'error'
        no_stand_alone_at:
          level: 'error'
      directives:
        files: src: ["#{MODULES_DIR}/*/*/*.coffee"]
        max_line_length:
          value: 79
          level: 'error'
      tests:
        files: src: ["#{MODULES_DIR}/*/*/test/*.coffee"]
      gruntfile:
        files: src: ['Gruntfile.coffee']

    concat:
      vendors:
        src: [VENDOR_FILES]
        dest: "#{BUILD_DIR}/vendor.js"

    karma:
      options:
        configFile: 'karma.conf.js'
      continuous:
        singleRun: true
        browsers: ['PhantomJS']
      unit:
        background: true
        browsers: ['Chrome']

    less: dev: files: 'dist/bradypodion.css': ['modules/directives/*/less/*']

    shell:
      options:
        stderr : true
        stdout : true
        failOnError : true
      docs:
        command: './node_modules/codo/bin/codo modules -o docs'
      semver:
        command: './node_modules/semver-sync/bin/semver-sync -v'
      hooks:
        command: 'cp -R ./hooks ./.git/'

    watch:
      lib:
        files: "#{MODULES_DIR}/**"
        tasks: ['build', 'karma:unit:run']

  # Load grunt-* plugins
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.registerTask 'build', ['clean:build', 'concat', 'coffee', 'less']
  grunt.registerTask 'dist',  ['clean:dist', 'coffee:dist', 'less']
  grunt.registerTask 'test',  ['bower:install', 'build', 'karma:continuous']

  grunt.registerTask 'default',   ['build']
  grunt.registerTask 'dev',       [
    'bower:install'
    'shell:hooks'
    'build'
    'karma:unit'
    'watch'
  ]
  grunt.registerTask 'docs',      ['dist', 'shell:docs']
  grunt.registerTask 'precommit', ['shell:semver', 'coffeelint', 'dist']
