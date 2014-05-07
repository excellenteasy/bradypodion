'use strict'

module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  require('time-grunt') grunt
  pck = grunt.file.readJSON 'package.json'

  grunt.initConfig
    bp:
      app: 'src'
      dist: 'dist'
      demo: 'demo'
      docs: 'docs'
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
          banner: grunt.file.read 'src/banner.template'
        files: [
          '<%=bp.dist%>/bradypodion.css': '<%=bp.dist%>/bradypodion.css'
          '<%=bp.dist%>/bradypodion.less': '<%=bp.dist%>/bradypodion.less'
        ]

    uglify:
      dist:
        options:
          mangle: off
          compress: off
          beautify:
            beautify: true
            bracketize: true
            'indent_level': 2
            'indent_start': 2
          preserveComments: 'some'
          banner: grunt.file.read('src/banner.template') +
                  grunt.file.read 'src/header.template'
          footer: grunt.file.read 'src/footer.template'
        files: [
          '<%=bp.dist%>/bradypodion.js': [
            '<%=bp.app%>/scripts/bradypodion.js'
            '<%=bp.app%>/scripts/*/**/*.js'
            '!<%=bp.app%>/scripts/*/iscroll.js'
          ]
          '<%=bp.dist%>/bradypodion-iscroll.js': [
            '<%=bp.app%>/scripts/iscroll.js'
            '<%=bp.app%>/scripts/*/iscroll.js'
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
        tasks: [ 'uglify:dist', 'ngmin', 'karma:unit:run' ]

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
      docs: '<%=bp.docs%>/build'
      server: '<%=bp.tmp%>/test'

    ngdocs:
      options:
        dest: '<%=bp.docs%>/build'
        title: 'Bradypodion'
        titleLink: 'http://bradypodion.io/'
        startPage: 'guides'
        navTemplate: '<%=bp.docs%>/navigation.html'
        html5Mode: off
        bestMatch: on
      guides:
        src: ['<%=bp.docs%>/content/guides/**/*.ngdoc']
        title: 'Guides'
      api:
        src: ['<%=bp.docs%>/content/api/**/*.ngdoc', '<%=bp.app%>/scripts/**/*.js']
        title: 'Documentation'

    concurrent:
      build: [
        'uglify:dist'
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

    coveralls: options: coverage_dir: 'test/coverage'

    bump: options:
      commitMessage: 'v%VERSION%'
      files: ['package.json', 'bower.json']
      commitFiles: [
        'bower.json'
        'package.json'
        'CHANGELOG.md'
        'dist/bradypodion.less'
        'dist/bradypodion.css'
        'dist/bradypodion.js'
        'dist/bradypodion-iscroll.js'
      ]
      push: no

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
        modules.push matches[1].replace('src/','')

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
    @args.unshift 'bump-only'
    grunt.task.run [
      @args.join ':'
      'build'
      'changelog'
      'bump-commit'
    ]

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

  grunt.registerTask 'coverage', ->
    shell = grunt.config.get 'shell'
    coverage = require('glob').sync('test/coverage/**/lcov.info')[0]
    shell.coverage =
      command: "./node_modules/codeclimate-test-reporter/bin/codeclimate.js < '#{coverage}'"
    grunt.config.set 'shell', shell

    grunt.task.run [
      'coveralls'
      'shell:coverage'
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

  grunt.registerTask 'docs', [
    'clean:docs'
    'ngdocs'
  ]

  grunt.registerTask 'default', ['test']
