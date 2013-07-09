'use strict'

# Constants
DIRECTIVES_DIR   = 'modules/directives'
BUILD_DIR        = 'build'
DIST_DIR        = 'dist'
VENDOR_FILES     = 'components/*/index.js'

module.exports = (grunt) ->

  grunt.initConfig
    clean:
      build: [BUILD_DIR]
      dist: [DIST_DIR]

    coffee:
      dist:
        options:
          sourceMap: true
          join: yes
        src: ["#{DIRECTIVES_DIR}/*/*.coffee"]
        dest: "#{DIST_DIR}/bradypodion.js"
      directives:
        options: join: yes
        src: ["#{DIRECTIVES_DIR}/*/*.coffee"]
        dest: "#{BUILD_DIR}/directives.js"
      tests:
        options: join: yes
        src: ["#{DIRECTIVES_DIR}/*/test/*.coffee"]
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
        files: src: ["#{DIRECTIVES_DIR}/*/*.coffee"]
        max_line_length:
          value: 79
          level: 'error'
      tests:
        files: src: ["#{DIRECTIVES_DIR}/*/test/*.coffee"]

    concat:
      test_vendors:
        src: [VENDOR_FILES]
        dest: "#{BUILD_DIR}/test_vendor.js"
      vendors:
        src: [VENDOR_FILES, '!components/qunit/index.js']
        dest: "#{BUILD_DIR}/vendor.js"

    qunit: directives: src: ['test/index.html']

    shell:
      options:
        stderr : true
        stdout : true
        failOnError : true
      semver:
        command: './node_modules/semver-sync/bin/semver-sync -v'
      hooks:
        command: 'cp -R ./hooks ./.git/'

    watch:
      lib:
        files: "#{DIRECTIVES_DIR}/**"
        tasks: ['coffee', 'qunit']

  # Load grunt-* plugins
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.registerTask 'build', ['clean:build', 'concat', 'coffee:directives', 'coffee:tests']
  grunt.registerTask 'dist',  ['clean:dist', 'coffee:dist']
  grunt.registerTask 'test',  ['build', 'qunit']

  grunt.registerTask 'precommit', ['shell:semver', 'coffeelint', 'dist']
  grunt.registerTask 'default',   ['build']
