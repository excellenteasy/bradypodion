'use strict'

# Constants
DIRECTIVES_DIR   = 'modules/directives'
BUILD_DIR        = 'build'
VENDOR_FILES     = 'components/*/index.js'

module.exports = (grunt) ->

  grunt.initConfig
    clean: build: [BUILD_DIR]

    coffee:
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

    watch:
      lib:
        files: "#{DIRECTIVES_DIR}/**"
        tasks: ['coffee', 'qunit']

  # Load grunt-* plugins
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.registerTask 'default', ['clean:build', 'concat', 'coffee', 'qunit']
  grunt.registerTask 'test', ['default']