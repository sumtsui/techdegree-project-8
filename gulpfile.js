const gulp = require('gulp'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      del = require('del'),
      // useref = require('gulp-useref'),
      csso = require('gulp-csso'),
      imagemin = require('gulp-imagemin'),
      connect = require('gulp-connect'),
      open = require('gulp-open'),
      iff = require('gulp-if');

const options = {
  src: 'src',
  dist: 'dist',
  port: 8888
};

gulp.task('styles', () => {
  return gulp.src(options.src + '/sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(maps.write('./')) // dir relative to gulp.dest dir
    .pipe(gulp.dest(options.dist + '/styles'))
    .pipe(connect.reload());
});

gulp.task('scripts', () => {
  return gulp.src([
    options.src + '/js/jquery.js',
    options.src + '/js/circle/autogrow.js',
    options.src + '/js/circle/circle.js',
    options.src + '/js/global.js'
  ])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.dist + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch([
    options.src + '/sass/**/**/*.sass', options.src + '/sass/**/*.sass', options.src + '/sass/*.scss'], ['styles']);
  gulp.watch(options.src + '/js/global.js', ['scripts']);
});

gulp.task('clean', () => {
  del(['dist']);
});

gulp.task('images', () => {
  return gulp.src('src/images/*')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/content'));
});

gulp.task('build', ['clean', 'styles', 'scripts', 'images', 'watch', 'connect'], () => {
  gulp.src([
        options.src + '/index.html',
        options.src + '/icons/**'], { base: './' + options.src})
      .pipe(gulp.dest(options.dist + '/'))
      .pipe(iff('index.html', open({ uri: `http://localhost:${options.port}` })));
});

gulp.task('default', () => {
  gulp.start('build');
});

gulp.task('connect', () => {
  return connect.server({
      port: options.port,
      root: 'dist',
      livereload: true
    });
});

// gulp.task('html', ['compileSass'], () => {
//   gulp.src(options.src + '/index.html')
//     .pipe(useref())
//     .pipe(iff('*.js', uglify()))
//     .pipe(iff('*.css', csso()))
//     .pipe(gulp.dest(options.dist + '/'));
// });

// gulp.task('serve', ['watch']);

// gulp.task('styles', ['compileSass'], () => {
//   return gulp.src(options.dist + '/styles/all.css')
//     .pipe(csso())
//     .pipe(rename('all.min.css'))
//     .pipe(gulp.dest(options.dist + '/styles'))
//     .pipe(connect.reload());
// });

// gulp.task('scripts', ['concatScripts'], () => {
//   return gulp.src(options.dist + '/scripts/all.js')
//     .pipe(uglify())
//     .pipe(rename('all.min.js'))
//     .pipe(gulp.dest(options.dist + '/scripts'))
//     .pipe(connect.reload());
// });