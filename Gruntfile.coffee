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
      build: [
        'coffee:app'
        'coffee:dist'
        'cssbuild'
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

    less: dist:
      src: ['<%=bp.dist%>/bradypodion.less']
      dest: '<%=bp.dist%>/bradypodion.css'

  grunt.registerTask 'cssbuild', ->
    # config
    styles      = grunt.template.process '<%=bp.app%>/styles'
    template    = "#{styles}/bradypodion.less"
    modulePaths = "#{styles}/*/*/*.less"
    fileContent = grunt.file.read template

    modules = []

    grunt.file.expand(modulePaths).forEach (path) ->
      matches = path.match(/(^(.*\/|)([a-zA-Z0-9-_.]+))\.less$/)
      if matches[3] is 'class'
        modules.push matches[1].replace('modules/','')

    grunt.template.addDelimiters 'less', '/*%', '%*/'

    fileContent = grunt.template.process fileContent,
      data: {modules}
      delimiters: 'less'

    grunt.file.write grunt.template.process(
      "<%=bp.dist%>/bradypodion.less"
    ), fileContent

    # compile less
    grunt.task.run ['less:dist']

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
        git add -f dist/bradypodion.less &&
        git add -f dist/bradypodion.css &&
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
        'concurrent'
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
    'concurrent'
  ]

  grunt.registerTask 'default', ['test']
