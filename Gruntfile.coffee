'use strict'

# Constants
DIRECTIVES_DIR   = 'modules/directives'
BUILD_DIR        = 'build'
VENDOR_FILES     = 'components/*/index.js'

module.exports = (grunt) ->

  grunt.initConfig
    clean: build: [BUILD_DIR]

    concat:
      test_vendors:
        src: [VENDOR_FILES]
        dest: "#{BUILD_DIR}/test_vendor.js"
      vendors:
        src: [VENDOR_FILES, '!components/qunit/index.js']
        dest: "#{BUILD_DIR}/vendor.js"

    coffee:
      directives:
        options: join: yes
        src: ["#{DIRECTIVES_DIR}/*/*.coffee"]
        dest: "#{BUILD_DIR}/directives.js"
      tests:
        options: join: yes
        src: ["#{DIRECTIVES_DIR}/*/test/*.coffee"]
        dest: "#{BUILD_DIR}/tests.js"

    qunit: directives: src: ['test/index.html']

    watch:
      lib:
        files: "#{DIRECTIVES_DIR}/**"
        tasks: ['coffee', 'qunit']

  # Load grunt-* plugins
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.registerTask 'default', ['clean:build', 'concat', 'coffee', 'qunit']
  grunt.registerTask 'test', ['default']