var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


gulp.task('styles', function () {
    gulp.src('styles/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({style: 'expanded'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/styles'))
});


// browserSync proxy port 3000 for nodemon
gulp.task('browser-sync', ['nodemon'], function () {
    browserSync.init({
        proxy: "http://localhost:3000",
        files: ["./public/app/*.*","./public/images/*.*","./public/styles/*.*"],
        browser: "google-chrome",
        port: 4000
    });
});
gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
        script: './app.js'
    }).on('start', function onStart() {
        if (!called) {
            cb();
        }
        called = true;
    }).on('restart', function onRestart() {
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 500);
    });

});

gulp.task('watch', function () {
    gulp.watch('./styles/**/*.scss', ['styles']);
});

gulp.task('build', ['styles']);

gulp.task('default', ['build', 'browser-sync', 'watch']);
