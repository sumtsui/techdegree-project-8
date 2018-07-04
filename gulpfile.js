const gulp = require('gulp'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      cssnano = require('gulp-cssnano'),
      del = require('del'),
      useref = require('gulp-useref'),
      iff = require('gulp-if'),
     csso = require('gulp-csso');

const options = {
  src: 'src',
  dist: 'dist'
};

/*** Develop ***/

gulp.task('compileSass', () => {
  return gulp.src(options.src + '/sass/global.scss')
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./')) // dir relative to gulp.dest dir
      .pipe(gulp.dest(options.src + '/css'));  // absolute dir 
});

gulp.task('concatScripts', () => {
  return gulp.src([
    options.src + '/js/jquery.js',
    options.src + '/js/circle/autogrow.js',
    options.src + '/js/circle/circle.js',
    options.src + '/js/global.js'
  ])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.src + '/js'));
});

gulp.task('watch', () => {
  gulp.watch([
    options.src + '/sass/**/**/*.sass', options.src + '/sass/**/*.sass', options.src + '/sass/*.scss'], ['compileSass']);
  gulp.watch(options.src + '/js/global.js', ['concatScripts']);
});

gulp.task('clean', () => {
  del(['dist', options.src + '/css/global*.css*', options.src + '/js/all*.js*']);
});

gulp.task('serve', ['watch']);

/*** Build ***/

gulp.task('styles', ['compileSass'], () => {
  return gulp.src(options.src + '/css/global.css')
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest(options.dist + '/css'));
});

gulp.task('scripts', ['concatScripts'], () => {
  return gulp.src(options.src + '/js/all.js')
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest(options.dist + '/js'));
});

// gulp.task('html', () => {
//   gulp.src(options.src + '/index.html')
//     .pipe(useref())
//     .pipe(gulp.dest(options.dist + '/'));
// });

gulp.task('build', ['clean', 'styles', 'scripts'], () => {
  gulp.src([
    options.src + '/index.html', 
    options.src + '/images/**', 
    options.src + '/icons/**'], { base: './' + options.src})
      .pipe(iff('index.html', useref()))
      .pipe(gulp.dest(options.dist + '/'));
});

gulp.task('default', () => {
  gulp.start('build');
});

gulp.task('test', ['clean', 'styles', 'scripts', 'html'], () => {
  console.log('done!');
});