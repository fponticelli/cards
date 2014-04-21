'use strict';

var path       = require('path'),
    fs         = require('fs'),
    browserify = require('browserify'),
    es6ify     = require('es6ify'),
    jadeify    = require('jadeify'),
    bundlePath = path.join(__dirname, 'public/app/main.js'),
    syms       = ['ui', 'streamy'];

syms.map(function(p) {
  var dst = path.join(__dirname, 'node_modules', p),
      src = path.join(__dirname, 'lib', p);
  if(!fs.existsSync(dst)) {
    fs.symlinkSync(src, dst);
  }
});

es6ify.traceurOverrides = { blockBinding: true };


browserify()
  .transform(jadeify)
  .add(es6ify.runtime)
  .transform(es6ify.configure(/^((?!.*node_modules)+.+\.js|(?:.*node_modules\/(ui|streamy)\/)+.+\.js$)$/))
  .require(require.resolve('./client/main.js'), { entry: true })
  .bundle({ debug: true })
  .on('error', function (err) { console.error(err); })
  .pipe(fs.createWriteStream(bundlePath));