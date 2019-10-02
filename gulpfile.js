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
  spritesmith = require("gulp.spritesmith"),
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
    fonts: 'build/fonts/',
    js: 'build/js/'
  },
  src: {
    pug: 'src/*.pug',
    style: 'src/sass/main.sass',
    img: 'src/images/**/*.*',
    pngSprite: 'src/sprite/png/',
    fonts: 'src/fonts/**/*.*',
    js: 'src/js/index.js'
  },
  watch: {
    pug: 'src/**/*.pug',
    style: 'src/sass/**/*.*',
    img: 'src/images/**/*.*',
    pngSprite: 'src/sprite/png/*.png',
    fonts: 'src/fonts/**/*.*',
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

gulp.task('fonts:build', (done) => {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
  done();
});

// PNG Sprites
gulp.task('png-sprite', (done) => {
  const spriteData =
    gulp.src(path.src.pngSprite + '*.png')
      .pipe(spritesmith({
        retinaSrcFilter: path.src.pngSprite + '*@2x.png',
        imgName: 'sprite.png',
        retinaImgName: 'sprite@2x.png',
        cssName: '_png-sprite.sass',
        cssTemplate: 'sass.template.mustache',
        cssVarMap: (sprite) => {
          sprite.name = sprite.name;
          sprite.image2x = 'sprite@2x.png';
        }
      }));

  spriteData.img.pipe(gulp.dest('src/images/'));
  spriteData.css.pipe(gulp.dest('src/sass/'));
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
  'fonts:build',
  'image:build',
  'png-sprite',
  'js:build'
));

gulp.task('watch', (done) => {
  gulp.watch(path.watch.pug, gulp.series('html:build'));
  gulp.watch(path.watch.style, gulp.series('style:build'));
  gulp.watch(path.watch.img, gulp.series('image:build'));
  gulp.watch(path.watch.pngSprite, gulp.series('png-sprite'));
  gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
  gulp.watch(path.watch.js, gulp.series('js:build'));
  done();
});

gulp.task('default', gulp.series('build', 'browser-sync', 'watch'));