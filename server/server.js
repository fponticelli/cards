'use strict';

let express    = require('express'),
    stylus     = require('stylus'),
    nib        = require('nib'),
    livereload = require('express-livereload'),
    app        = express(),
    cwd        = __dirname + '/..';

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', cwd + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware({
  src: cwd + '/public',
  compile: compile
}));

app.use(express.static(cwd + '/public'));

['index', 'examples', 'blocks', 'live'].forEach(function (value) {
  app.get('/' + (value === 'index' ? '' : value), function (req, res) {
    res.render(value, { title : value });
  });
});

livereload(app, {
  watchDir: cwd
});

app.listen(3000);