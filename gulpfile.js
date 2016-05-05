var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');

gulp.task('copy-html-files', function() {
    gulp.src(['app/*.html', '!app/index.html'], {base: 'app'})
      .pipe(gulp.dest('build/'));
});

gulp.task('usemin', function() {
    gulp.src('app/index.html')
        .pipe(usemin({
                css: [minifyCSS(), 'concat'],
                      js: [uglify()]
                          }))
                              .pipe(gulp.dest('build/'));
});

gulp.task('build', ['copy-html-files', 'usemin']);
gulp.task('default', ['copy-html-files', 'usemin']);
