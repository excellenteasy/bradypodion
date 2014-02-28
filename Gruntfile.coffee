'use strict'

module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  require('time-grunt') grunt
  pck = grunt.file.readJSON 'package.json'

  grunt.initConfig
    bp:
      app: 'modules'
      dist: 'dist'
      demo: 'demo'
      test: 'test'
      tmp: '.tmp'
      platforms: ['android', 'ios']

    meta:
      date: grunt.template.today 'isoDateTime'
      homepage: pck.homepage
      private: pck.private
      version: pck.version
      year: grunt.template.today 'yyyy'

    concat:
      banner:
        options:
          stripBanners: true,
          banner: grunt.file.read 'modules/banner.template'
        files: [
          '<%=bp.dist%>/bradypodion.css': '<%=bp.dist%>/bradypodion.css'
          '<%=bp.dist%>/bradypodion.less': '<%=bp.dist%>/bradypodion.less'
        ]
      dist:
        options:
          stripBanners: true,
          banner: grunt.file.read('modules/banner.template') +
                  grunt.file.read 'modules/header.template'
          footer: grunt.file.read 'modules/footer.template'
        files: [
          '<%=bp.dist%>/bradypodion.js': [
            '<%=bp.app%>/scripts/bradypodion.js'
            '<%=bp.app%>/scripts/*/**/*.js'
            '!<%=bp.app%>/scripts/directives/iscroll.js'
          ]
          '<%=bp.dist%>/bradypodion-iscroll.js': [
            '<%=bp.app%>/scripts/directives/iscroll.js'
          ]
        ]

    ngmin:
      dist:
        files: [
          expand: yes
          src: '<%=bp.dist%>/*.js'
          ext: '.js'
        ]

    jshint:
      all:
        options: jshintrc: yes
        src: ['<%=bp.app%>/scripts/**/*.js']
      test:
        options: do ->
          options = grunt.file.readJSON '.jshintrc'
          options.undef = no
          options
        src: ['<%=bp.test%>/spec/**/*.js']

    jscs:
      all: ['<%=bp.app%>/scripts/**/*.js', '<%=bp.test%>/spec/**/*.js']

    watch:
      options:
        livereload: '<%= connect.options.livereload %>'

      app:
        files: ['<%=bp.demo%>/app.js']
        tasks: []

      dist:
        files: [
          '<%=bp.app%>/scripts/bradypodion.js'
          '<%=bp.app%>/scripts/*/**/*.js'
        ]
        tasks: [ 'concat:dist', 'ngmin', 'karma:unit:run' ]

      tests:
        files: ['test/spec/**/*.js']
        tasks: ['karma:unit:run']

      less:
        options: livereload: off
        files: ['<%=bp.app%>/styles/**/*.less']
        tasks: ['cssbuild']

      css:
        files: ['<%=bp.dist%>/bradypodion.css']

      views:
        files: ['<%=bp.demo%>/**/*.html']

    connect:
      options:
        port: 9000
        host: '*'
        livereload: 35729
        open: 'http://localhost:9000/'

      server:
        options:
          base: [
            '<%=bp.tmp%>'
            '<%=bp.app%>'
            '<%=bp.dist%>'
            '<%=bp.demo%>'
          ]

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

    concurrent:
      build: [
        'concat:dist'
        'cssbuild'
      ]

    karma:
      options:
        configFile: 'karma.conf.coffee'
      continuous:
        singleRun: true
      unit:
        port: 9877
        background: true

    coveralls:
      options:
        coverage_dir: 'test/coverage'

    less: dist:
      src: ['<%=bp.app%>/styles/build.less']
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

    oldVersion = pck.version
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
        git add -f dist/bradypodion-iscroll.js &&
        git add -f CHANGELOG.md &&
        git commit -m 'v#{newVersion}' &&
        git tag v#{newVersion}",
    (error, stdout, stderr) ->
      grunt.log.writeln stderr if stderr
      grunt.log.writeln stdout if stdout
      done error or {}

  grunt.registerTask 'server', ->
    grunt.fail.fatal '`grunt server` is deprecated, use `grunt serve` instead.'

  grunt.registerTask 'serve', (target) ->
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
    'jshint'
    'jscs'
  ]

  grunt.registerTask 'test', [
    'clean:server'
    'build'
    'jshint'
    'jscs'
    'karma:continuous'
  ]

  grunt.registerTask 'build', [
    'clean:dist'
    'concurrent'
    'ngmin'
    'concat:banner'
  ]

  grunt.registerTask 'default', ['test']
