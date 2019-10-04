"use strict";
const gulp = require('gulp'),
  pug = require('gulp-pug'),
  prefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-cssmin'),
  sass = require('gulp-sass'),
  sassLint = require('gulp-sass-lint'),
  sourcemaps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  plumber = require('gulp-plumber'),
  rigger = require("gulp-rigger"),
  notify = require("gulp-notify"),
  babel = require("gulp-babel"),
  browserSync = require('browser-sync').create();

const path = {
  build: {
    html: 'build/',
    css: 'build/css/',
    img: 'build/images/',
    js: 'build/js/'
  },
  src: {
    pug: 'src/*.pug',
    style: 'src/sass/main.sass',
    img: 'src/images/**/*.*',
    js: 'src/js/index.js'
  },
  watch: {
    pug: 'src/**/*.pug',
    style: 'src/sass/**/*.*',
    img: 'src/images/**/*.*',
    js: 'src/js/*.js'
  }
};

gulp.task('browser-sync', (done) => {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  done();
});

gulp.task('html:build', (done) => {
  gulp.src(path.src.pug)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
  done();
});

gulp.task('style:build', (done) => {
  gulp.src(path.src.style)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(sass({errLogToConsole: true}))
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
  done();
});

gulp.task('sassLint', (done) => {
  gulp.src('src/sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
  done();
});

gulp.task('image:build', (done) => {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
  done();
});

gulp.task('js:build', (done) => {
  gulp.src(path.src.js)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
  done();
});

gulp.task('build', gulp.series(
  'html:build',
  'style:build',
  'image:build',
  'js:build'
));

gulp.task('watch', (done) => {
  gulp.watch(path.watch.pug, gulp.series('html:build'));
  gulp.watch(path.watch.style, gulp.series('style:build'));
  gulp.watch(path.watch.img, gulp.series('image:build'));
  gulp.watch(path.watch.js, gulp.series('js:build'));
  done();
});

gulp.task('default', gulp.series('build', 'browser-sync', 'watch'));