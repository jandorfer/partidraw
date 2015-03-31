var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', function () {
    return browserify({
        entries: './src/partidraw.js',
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('partidraw.out.js'))
    .pipe(gulp.dest('demo'));
});