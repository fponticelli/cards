var gulp       = require('gulp'),
    changed    = require('gulp-changed'),
    stylus     = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    nib        = require('nib');

var paths = {
  src : {
    main : {
      stylus : 'src/main.styl',
      styluses : 'src/**/*.styl'
    },
    editors : {
      stylus : 'editors/editors.styl',
      styluses : 'editors/**/*.styl'
    }
    // assets: './assets/**/*.*'
  },
  dst : {
    debug : {
      stylus : 'bin/css/',
    },
    release : {
      stylus : 'release/css/',
    }
  }
}

gulp.task('stylus-main', function() {
    gulp.src(paths.src.main.stylus)
        .pipe(changed(paths.dst.debug.stylus))
        .pipe(stylus({use: [nib()], errors: true}))
        .pipe(gulp.dest(paths.dst.debug.stylus));
});

gulp.task('stylus-editors', function() {
    gulp.src(paths.src.editors.stylus)
        .pipe(changed(paths.dst.debug.stylus))
        .pipe(stylus({use: [nib()], errors: true}))
        .pipe(gulp.dest(paths.dst.debug.stylus));
});

gulp.task('release', function() {
    gulp.src(paths.src.main.stylus)
        .pipe(changed(paths.dst.release.stylus))
        .pipe(stylus({use: [nib()], errors: true}))
        .pipe(gulp.dest(paths.dst.release.stylus));
});

/*
gulp.task('assets', function() {
    gulp.src(paths.src.assets)
        .pipe(gulp.dest(paths.dst.assets));
});
*/

gulp.task('watch', function() {
//    gulp.watch(paths.src.assets, ['assets']);
    gulp.watch(paths.src.main.styluses, ['stylus-main']);
    gulp.watch(paths.src.editors.styluses, ['stylus-editors']);
    livereload.listen();
    gulp.watch('bin/**').on('change', livereload.changed);
});

gulp.task('default', [/*'assets', */'stylus-main','stylus-editors', 'watch']);