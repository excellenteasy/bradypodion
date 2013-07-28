(function() {
  var scripts = [
    'components/lodash/index.js',
    'components/jquery/index.js',
    'components/iscroll/index.js',
    'components/iscroll-sticky/index.js',
    'components/angular/index.js',
    'components/angular-ui-router/index.js',
    'dist/bradypodion.js'
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports.scripts = scripts;
  } else {

    var pathDeepness = document.querySelector('script').attributes.src.nodeValue.replace('deps.js','');
    scripts = scripts.map(function (script) {
      return pathDeepness+script;
    });

    if (!/phantom/i.test(navigator.userAgent) && document.location.protocol !== 'file:') {
      scripts.push(window.location.protocol + '//' + window.location.hostname + ':35729/livereload.js');
    } else {
      console.warn('Bradypodion: "Serve this site from a webserver to enable livereload."');
    }

    (function load(i){
      var s  = document.createElement('script');
      s.type = 'text/javascript';
      s.src  = scripts[i];
      s.addEventListener('load', function(e){
        i++;
        if (scripts[i]) {
          load(i);
        } else if (typeof finalLoad === 'function'){
          finalLoad();
        }
      });
      if (/livereload/.test(scripts[i])) {
        s.addEventListener('error', function(e){
          console.warn('Bradypodion: "Run `grunt dev` in your terminal to enable livereload."');
          if (typeof finalLoad === 'function'){
            finalLoad();
          }
        });
      }
      document.body.appendChild(s);
    })(0);

  }

}).call(this);
