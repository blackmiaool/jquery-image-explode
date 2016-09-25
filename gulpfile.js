const gulp = require('gulp');
const path = require('path');
const concat = require("gulp-concat");
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const livereload = require('gulp-livereload');

function get_babel_params() {
    return {
        presets: ['es2015'],
    }
}
gulp.task('default', function () {
    let babel_pipe = babel(get_babel_params());
    babel_pipe.on('error', function (e) {
        gutil.log(e);
        babel_pipe.end();
    });

    return gulp.src(['jquery.imgexplode.js'])
        .pipe(babel_pipe)
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('dist'))
        .pipe(livereload())
});
livereload.listen();
gulp.watch('./*.js', ['default']);
gulp.watch('index.html', ['default']);