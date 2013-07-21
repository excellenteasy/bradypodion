'use strict'

# Constants
MODULES_DIR      = 'modules'
BUILD_DIR        = 'build'
DIST_DIR         = 'dist'
GRUNTFILE        = 'Gruntfile.coffee'
TMP_DIR          = 'tmp'
PLATFORMS        = ['android', 'ios', 'ios7']

module.exports = (grunt) ->

  grunt.initConfig
    bower:
      install:
        cleanup: yes
        copy: no

    clean:
      build: [BUILD_DIR]
      dist: [DIST_DIR]
      tmp: TMP_DIR
      lib: 'lib'

    coffee:
      dist:
        options:
          sourceMap: yes
          join: yes
        src: [
          "#{MODULES_DIR}/bradypodion.coffee"
          '<%= coffeelint.directives.files.src %>'
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
        files: src: "<%= coffee.tests.src %>"
      gruntfile:
        files: src: [GRUNTFILE]

    groc:
      options:
        out: 'docs/'
        index: "#{MODULES_DIR}/index.md"
        strip: "#{MODULES_DIR}"
      modules: [
        "#{MODULES_DIR}/index.md"
        "#{MODULES_DIR}/**/*.{coffee,less,md}"
        "!#{MODULES_DIR}/**/test.coffee"
        "!#{MODULES_DIR}/_less/*.less"
        "!#{MODULES_DIR}/bradypodion.*"]

    karma:
      options:
        configFile: 'karma.conf.js'
      continuous:
        singleRun: true
        browsers: ['PhantomJS']
      unit:
        background: true
        browsers: ['Chrome']

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
      options:
        livereload: true
      grunt:
        files: '<%= coffeelint.gruntfile.files.src %>'
      demo:
        files: "#{MODULES_DIR}/**/*.html"
      tests:
        files: "#{MODULES_DIR}/*/*/test/*.coffee"
        tasks: ['coffee:tests', 'karma:unit:run']
      coffee:
        files: "#{MODULES_DIR}/*/*/*.coffee"
        tasks: ['coffee', 'karma:unit:run']
      less:
        files: "#{MODULES_DIR}/**/*.less"
        tasks: ['cssbuild']

    # internal tasks don't use by hand
    less: all:
      dest: "#{DIST_DIR}/bradypodion.css"
      src: ['<%= clean.tmp %>/bradypodion.less']

  grunt.registerTask 'cssbuild', ->
    # config
    template = 'modules/bradypodion.less'
    configs  = "#{MODULES_DIR}/_less/*.less"
    modules  = "#{MODULES_DIR}/*/*/less/*.less"

    # parse task flags
    platforms = []
    if @args.length then @args.forEach (arg) ->
      arg = arg.toLowerCase()
      index = PLATFORMS.indexOf arg
      if index >= 0
        platforms.push arg
        PLATFORMS.splice index, 1
    else
      platforms = PLATFORMS
      lessTask = 'less:all'

    toBeNamespaced = platforms.length > 1
    fileContent    = grunt.file.read template

    chunks =
      general: ''
    chunks[platform] = '' for platform in platforms

    # importer function
    importer = (path) ->
      matches = path.match(/(^(.*\/|)([a-zA-Z0-9-_.]+))\.less$/)
      platform = matches[3]
      if platform in platforms or platform is 'general'
        chunk = "@import '../#{matches[1]}';"
        chunks[platform] += chunk

    # import config and modules
    grunt.file.expand(configs).forEach importer
    grunt.file.expand(modules).forEach importer

    # append imports to template and namespace them if necessary
    for platform, chunk of chunks
      fileContent += if toBeNamespaced and platform isnt 'general'
        ".#{platform} {#{chunk}}"
      else
        chunk

    grunt.file.write 'tmp/bradypodion.less', fileContent

    # create less task configuration on runtime depending on platforms
    unless lessTask
      filename = platforms.sort().join '.'
      config = grunt.config.get 'less'
      config.custom =
        src: ["<%= clean.tmp %>/bradypodion.less"]
        dest: "#{DIST_DIR}/bradypodion.#{filename}.css"
      grunt.config.set 'less', config
      lessTask = "less:custom"

    # compile less and clean up
    grunt.task.run [
      lessTask
      'clean:tmp']

  # Load grunt-* plugins
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.registerTask 'css', [
    'cssbuild'
    'cssbuild:android'
    'cssbuild:ios'
    'cssbuild:ios7']

  grunt.registerTask 'build', [
    'clean:build'
    'clean:dist'
    'coffee:dist'
    'css'
    'coffee:tests']

  grunt.registerTask 'dist', [
    'clean:dist'
    'coffee:dist'
    'css']

  grunt.registerTask 'test',  [
    'bower:install'
    'clean:lib'
    'build'
    'karma:continuous']

  grunt.registerTask 'default',   ['build']

  grunt.registerTask 'dev', [
    'bower:install'
    'clean:lib'
    'shell:hooks'
    'build'
    'karma:unit'
    'watch']

  grunt.registerTask 'docs',      ['dist', 'groc']
  grunt.registerTask 'precommit', ['shell:semver', 'coffeelint', 'dist']
