var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: __dirname + '/app',
    livereload: true
  });
});
gulp.task('html', function () {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

// JavaScript linting task
gulp.task('jshint', function() {
  return gulp.src('app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(connect.reload());
}); 

// Compile Sass task
gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths,
      includePaths: require('node-neat').includePaths
    }))
    .pipe(gulp.dest('./app/css/'))
    .pipe(connect.reload());
}); 

// Watch task
gulp.task('watch', function() {
  gulp.watch(['app/js/**/*.js'], ['jshint']);
  gulp.watch(['app/scss/**/*.scss'], ['sass']);
  gulp.watch(['app/**/*.html'], ['html']);
}); 

/* Styles build task, concatenates all the files
gulp.task('styles', function() {
  return gulp.src('app/css/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('app/build/css'));
}); 
*/

// Default task
gulp.task('default', ['jshint', 'sass', 'watch', 'connect']);



