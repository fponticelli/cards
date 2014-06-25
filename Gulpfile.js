var gulp    = require('gulp'),
	changed = require('gulp-changed'),
	stylus  = require('gulp-stylus');

var paths = {
	src : {
		stylus : 'src/main.styl',
		styluses : 'src/**/*.styl'
		// assets: './assets/**/*.*'
	},
	dst : {
		stylus : 'bin/css/'
		// assets: './www/assets'
	}
}

gulp.task('stylus', function() {
    gulp.src(paths.src.stylus)
        .pipe(changed(paths.dst.stylus))
        .pipe(stylus({use:['nib']}))
        .pipe(gulp.dest(paths.dst.stylus));
});

/*
gulp.task('assets', function() {
    gulp.src(paths.src.assets)
        .pipe(gulp.dest(paths.dst.assets));
});
*/

gulp.task('watch', function() {
//    gulp.watch(paths.src.assets, ['assets']);
    gulp.watch(paths.src.styluses, ['stylus']);
});

gulp.task('default', [/*'assets', */'stylus', 'watch']);