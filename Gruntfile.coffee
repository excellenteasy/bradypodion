'use strict'

module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  require('time-grunt') grunt
  grunt.initConfig
    bp:
      app: 'modules'
      dist: 'dist'
      tmp: '.tmp'
      platforms: ['android', 'ios']

    watch:
      options:
        livereload: '<%= connect.options.livereload %>'
      coffee:
        files: [
          '<%=bp.app%>/scripts/app.coffee'
          '<%=bp.app%>/scripts/bradypodion.coffee'
          '<%=bp.app%>/scripts/*/**/*.coffee'
        ]
        tasks: [
          'coffeelint:build'
          'coffee:app'
          'coffee:dist'
          'karma:unit:run'
        ]

      coffeeTest:
        files: ['test/spec/**/*.coffee']
        tasks: ['coffeelint:test', 'karma:unit:run']

      gruntfile:
        files: ['Gruntfile.coffee']
        tasks: ['coffeelint:gruntfile']

      styles:
        files: ['<%=bp.app%>/styles/**/*.less']
        tasks: ['cssbuild']

      views:
        files: ['<%=bp.app%>/index.html', '<%=bp.app%>/views/**/*.html']

    connect:
      options:
        port: 9000
        hostname: '*'
        livereload: 35729
        open: 'http://localhost:9000/'

      server:
        options:
          base: ['<%=bp.tmp%>', '<%=bp.app%>', '<%=bp.dist%>']

    shell:
      options:
        stderr : true
        stdout : true
        failOnError : true
      semver:
        command: './node_modules/semver-sync/bin/semver-sync -v'
      hooks:
        command: 'cp -R ./hooks ./.git/'

    clean:
      dist:
        files: [
          dot: true
          src: [
            '<%=bp.tmp%>/scripts/'
            '<%=bp.tmp%>/styles/'
            '<%=bp.dist%>/*'
            '!<%=bp.dist%>/.git*'
          ]
        ]

      server: '<%=bp.tmp%>/test'

    coffee:
      options:
        sourceMap: true
        sourceRoot: ''

      app:
        files:
          '<%=bp.tmp%>/scripts/app.js': '<%=bp.app%>/scripts/app.coffee'

      dist:
        options:
          join: yes
        src: [
          '<%=bp.app%>/scripts/bradypodion.coffee'
          '<%=bp.app%>/scripts/*/**/*.coffee'
        ]
        dest: '<%=bp.dist%>/bradypodion.js'

    coffeelint:
      options:
        newlines_after_classes:
          level: 'error'
        no_empty_param_list:
          level: 'error'
        no_stand_alone_at:
          level: 'error'
      build:
        files: src: [
          '<%=bp.app%>/scripts/bradypodion.coffee'
          '<%=bp.app%>/scripts/*/**/*.coffee'
        ]
        max_line_length:
          value: 79
          level: 'error'
      test:
        files: src: 'test/spec/**/*.coffee'
      gruntfile:
        files: src: ['Gruntfile.coffee']

    concurrent:
      server: [
        'coffee:app'
        'coffee:dist'
        'cssbuild'
      ]
      dist: [
        'coffee:app'
        'coffee:dist'
        'cssbuild'
        'cssbuild:android'
        'cssbuild:ios'
      ]

    karma:
      options:
        configFile: 'karma.conf.coffee'
      continuous:
        singleRun: true
        browsers: ['PhantomJS']
      unit:
        background: true
        browsers: ['Chrome']

    coveralls:
      options:
        coverage_dir: 'test/coverage'

  grunt.registerTask 'cssbuild', ->
    # config
    PLATFORMS = grunt.config.get('bp').platforms
    styles = grunt.template.process '<%=bp.app%>/styles'
    template = "#{styles}/bradypodion.less"
    configs  = "#{styles}/variables/*.less"
    modules  = "#{styles}/*/*/*.less"

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
      general = yes

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
        chunk = "@import '../../#{matches[1]}';"
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

    filename = if general
      ''
    else
      '.' + platforms.sort().join '.'

    grunt.file.write grunt.template.process(
      "<%=bp.tmp%>/styles/bradypodion#{filename}.less"
    ), fileContent

    # create less task configuration on runtime depending on platforms
    config =
      custom:
        src: ["<%=bp.tmp%>/styles/bradypodion#{filename}.less"]
        dest: "<%=bp.dist%>/bradypodion#{filename}.css"

    grunt.config.set 'less', config

    # compile less
    grunt.task.run ['less:custom']

  grunt.registerTask 'release', ->
    done = @async()

    {exec} = require 'child_process'
    semver = require 'semver'

    oldVersion = require('./package.json').version
    newVersion = @args[0]

    unless semver.valid newVersion
      grunt.fail.fatal "Invalid version specified: #{newVersion}"

    unless semver.gt newVersion, oldVersion
      grunt.fail.fatal "Version has to be greater than #{oldVersion}"

    exec "./node_modules/semver-sync/bin/semver-sync -b #{newVersion} &&
        grunt build changelog &&
        git add package.json bower.json &&
        git add -f dist/bradypodion.css &&
        git add -f dist/bradypodion.android.css &&
        git add -f dist/bradypodion.ios.css &&
        git add -f dist/bradypodion.js &&
        git add -f dist/bradypodion.js.map &&
        git add -f dist/bradypodion.src.coffee &&
        git add -f CHANGELOG.md &&
        git commit -m 'v#{newVersion}' &&
        git tag v#{newVersion}",
    (error, stdout, stderr) ->
      grunt.log.writeln stderr if stderr
      grunt.log.writeln stdout if stdout
      done error or {}

  grunt.registerTask 'server', (target) ->
    grunt.task.run if target isnt 'dist'
      [
        'shell:hooks'
        'clean:server'
        'concurrent:server'
        'connect:server'
        'karma:unit'
        'watch'
      ]
    else
      [
        'build'
        'connect:server:keepalive'
      ]

  grunt.registerTask 'precommit', [
    'shell:semver'
    'coffeelint'
  ]

  grunt.registerTask 'test', [
    'clean:server'
    'build'
    'karma:continuous'
  ]

  grunt.registerTask 'build', [
    'clean:dist'
    'coffeelint'
    'concurrent:dist'
  ]

  grunt.registerTask 'default', ['test']
