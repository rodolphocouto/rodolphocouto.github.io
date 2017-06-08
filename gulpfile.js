var gulp = require('gulp');
var del = require('del');
var clean = require('gulp-clean-css');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var streamqueue = require('streamqueue');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var minifyHtml = require('gulp-htmlmin');

// Delete dist/
gulp.task('clean', function () {
    return del.sync('dist/**', {force: true});
});

// Copy fonts
gulp.task('copy-fonts', function () {
    gulp.src(['node_modules/bootstrap/dist/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
    gulp.src(['node_modules/font-awesome/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
});

// Copy images
gulp.task('copy-images', function () {
    return gulp.src('src/img/**/*')
        .pipe(rev())
        .pipe(gulp.dest('dist/img'))
        .pipe(rev.manifest('dist/rev-manifest.json', {merge: true, base: 'dist'}))
        .pipe(gulp.dest('dist'));
});

// Minify and concat CSS
gulp.task('minify-concat-rev', ['copy-images'], function () {
    return streamqueue({objectMode: true},
        gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css'),
        gulp.src('node_modules/font-awesome/css/font-awesome.min.css'),
        gulp.src('src/css/theme.css').pipe(clean({compatibility: 'ie8'}))
    )
        .pipe(concat('styles.min.css'))
        .pipe(minify())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest('dist/rev-manifest.json', {merge: true, base: 'dist'}))
        .pipe(gulp.dest('dist'));
});

// Replace and minify index.html
gulp.task('minify-replace-html', ['minify-concat-rev'], function () {
    gulp.src('src/index.html')
        .pipe(revReplace({manifest: gulp.src('dist/rev-manifest.json')}))
        .pipe(minifyHtml({collapseWhitespace: true}))
        .pipe(gulp.dest(''));

    del('dist/rev-manifest.json', {force: true});
});

// Run everything
gulp.task('build', ['clean', 'copy-fonts', 'copy-images', 'minify-concat-rev', 'minify-replace-html']);