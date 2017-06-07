var gulp = require('gulp');
var del = require('del');
var clean = require('gulp-clean-css');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var rev = require('gulp-rev');

// Delete dist/
gulp.task('clean', function(){
    return del.sync('dist/**', {force:true});
});

// Copy fonts
gulp.task('copy-fonts', function() {
    gulp.src(['node_modules/bootstrap/dist/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
    gulp.src(['node_modules/font-awesome/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
});

// Minify and concat CSS
gulp.task('minify-concat-rev', function() {

    var bootstrapStream = gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css');
    var fontAwesomeStream = gulp.src('node_modules/font-awesome/css/font-awesome.min.css');
    var themeStream = gulp.src('css/theme.css').pipe(clean({ compatibility: 'ie8' }));

    return merge(bootstrapStream, fontAwesomeStream, themeStream)
        .pipe(concat('styles.min.css'))
        .pipe(minify())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'));
});

// Run everything
gulp.task('default', ['clean', 'copy-fonts', 'minify-concat-rev']);