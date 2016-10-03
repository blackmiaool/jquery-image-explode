const gulp = require('gulp');
const path = require('path');
const concat = require("gulp-concat");
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const livereload = require('gulp-livereload');
const less = require('gulp-less');
const pkg = require('./package.json');
const banner = require('gulp-banner');


var comment = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' *\n' +
    ' * Copyright 2015, <%= pkg.author %>\n' +
    ' * Released under the <%= pkg.license %> license.\n' +
    '*/\n\n';
gulp.task('js', function () {
    let babel_pipe = babel({
        presets: ['es2015'],
        minified: true,
    });
    babel_pipe.on('error', function (e) {
        gutil.log(e);
        babel_pipe.end();
    });

    return gulp.src(['jquery.imgexplode.js'])
        .pipe(babel_pipe)
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(uglify())
        .pipe(banner(comment, {
            pkg
        }))        
        .pipe(gulp.dest('dist'))
        .pipe(livereload())
});
gulp.task('playground-less', function () {
    let less = require('gulp-less');
    var e = less({});
    e.on('error', function (ee) {
        gutil.log(ee);
        this.emit('end');
    });
    return gulp.src('playground/less/*')
        .pipe(e)
        .pipe(gulp.dest("playground/css"))
        .pipe(livereload())
});
gulp.task('playground-js', function () {
    let babel_pipe = babel({
        presets: ['es2015'],
    });
    babel_pipe.on('error', function (e) {
        gutil.log(e);
        babel_pipe.end();
    });

    return gulp.src(['playground/js/*'])
        .pipe(babel_pipe)
        .pipe(gulp.dest('playground/dist'))
        .pipe(livereload())
});
gulp.task('playground', function () {
    return gulp.start(["js", "playground-js", "playground-less"]);
});
gulp.task('default', function () {
    return gulp.start(["js", 'playground'])
});
gulp.task('reload', function () {
    gulp.src("")
        .pipe(livereload());
});
livereload.listen();
gulp.watch('./*.js', ['js']);
gulp.watch('index.html', ['reload']);
gulp.watch('playground/js/*', ['playground-js']);
gulp.watch('playground/less/*', ['playground-less']);
gulp.watch('playground.html', ['reload']);