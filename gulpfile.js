import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import postcss from "gulp-postcss";
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import pug from 'gulp-pug';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import fileInclude from 'gulp-file-include';
import prettier from 'gulp-prettier';


const paths = {
  styles: 'src/scss/**/*.scss',
  scripts: 'src/js/**/*.js',
  pug: 'src/pug/**/*.pug',
  images: 'src/images/**/*',
  html: 'src/html/**/*.html',
  dist: {
    base: 'dist',
    css: 'dist/css',
    js: 'dist/js',
    images: 'dist/images',
  },
};


const sass = gulpSass(dartSass);
function styles() {
  return gulp
    .src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(paths.dist.css)) 

    // minify
    .pipe(cleanCSS({ level: 1 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.css)); 
}


function scripts() {
  return gulp
    .src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
}


function compilePug() {
  return gulp
    .src(paths.pug)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.dist.base))
    .pipe(browserSync.stream());
}


function images() {
  return gulp
    .src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.images));
}


function includeHTML() {
  return gulp
    .src(paths.html)
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest(paths.dist.base))
    .pipe(browserSync.stream());
}


function format() {
  return gulp
    .src([paths.styles, paths.scripts, paths.pug])
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest((file) => file.base));
}


function serve() {
  browserSync.init({
    server: {
      baseDir: paths.dist.base,
    },
  });

  gulp.watch(paths.styles, styles);
  gulp.watch(paths.scripts, scripts);
  gulp.watch(paths.pug, compilePug);
  gulp.watch(paths.html, includeHTML);
  gulp.watch(paths.images, images).on('change', browserSync.reload);
}


export {
  styles,
  scripts,
  compilePug,
  images,
  includeHTML,
  format,
  serve,
};


export default gulp.series(
  gulp.parallel(styles, scripts, compilePug, includeHTML, images),
  serve
);
