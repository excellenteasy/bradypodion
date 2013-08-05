var scripts = require(__dirname+'/deps.js').scripts;

// Karma configuration
// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
].concat(scripts);

files.push('components/angular-mocks/index.js');
files.push('build/tests.js');

preprocessors = {
  'dist/*.js': 'coverage'
};

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'coverage'];

// web server port
port = 9876;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;
