import gulp from 'gulp';
import gutil from 'gulp-util';
import injectVersion from 'gulp-inject-version';
import inject from 'gulp-inject';
import bump from 'gulp-bump';

import del from 'del';
import runSequence from 'run-sequence';
import series from 'stream-series';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel.js';

gulp.task('build:clean', () => {
    return del('./build/*');
});

gulp.task('build:webpack', (callback) => {
    webpack(webpackConfig, (err, stats) => {
        if(err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({
            colors: true,
            chunks: false,
            errorDetails: true
        }));
        callback();
    });
});

gulp.task('build:index-html', () => {
    var vendorStream = gulp.src('./build/js/vendor/*.js', { read: false });
    var appStream = gulp.src('./build/js/app/*.js', { read: false });
    var cssStream = gulp.src('./build/css/*.css', { read: false });

    return gulp.src('./src/index.html')
        .pipe(injectVersion({
            replace: '%%INJECT_VERSION%%',
            prepend: ''
        }))
        .pipe(inject(series(vendorStream, appStream, cssStream), { ignorePath: 'build' }))
        .pipe(gulp.dest('build'));
});

gulp.task('build', function(callback) {
    runSequence('build:clean', 'build:webpack', 'build:index-html', callback);
});

gulp.task('release-minor:bump', function () {
    return gulp.src(['./package.json'])
        .pipe(bump({ type:'minor' }))
        .pipe(gulp.dest('./'));
});

gulp.task('release-minor', function(callback) {
    runSequence('version:bump-minor', 'build', callback);
});

gulp.task('release-patch:bump', function () {
    return gulp.src(['./package.json'])
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./'));
});

gulp.task('release-patch', function(callback) {
    runSequence('version:bump-patch', 'build', callback);
});
