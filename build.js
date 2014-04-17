'use strict';

var path       = require('path'),
    fs         = require('fs'),
    browserify = require('browserify'),
    es6ify     = require('es6ify'),
    bundlePath = path.join(__dirname, 'public/app/main.js'),
    syms       = ['ext', 'cards'];

syms.map(function(p) {
  var dst = path.join(__dirname, 'node_modules', p),
      src = path.join(__dirname, 'lib', p);
  if(!fs.existsSync(dst)) {
    fs.symlinkSync(src, dst);
  }
});

es6ify.traceurOverrides = { blockBinding: true };

browserify()
  .add(es6ify.runtime)
  .transform(es6ify.configure(/^((?!.*node_modules)+.+\.js|(?:.*node_modules\/(ext|cards))+.+\.js$)$/))
  .require(require.resolve('./client/main.js'), { entry: true })
  .bundle({ debug: true })
  .on('error', function (err) { console.error(err); })
  .pipe(fs.createWriteStream(bundlePath));