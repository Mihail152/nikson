import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import postcss from "gulp-postcss";
import changed from 'gulp-changed';
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
  svg: 'src/svg/**/*',
  fonts: 'src/fonts/**/*',
  html: 'src/html/**/*.html',
  dist: {
    base: 'dist',
    css: 'dist/css',
    js: 'dist/js',
    images: 'dist/images',
    svg: 'dist/svg',
    fonts: 'dist/fonts',
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
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
}


function scripts() {
  return gulp
    .src(paths.scripts)
    
    // .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js))

    // .pipe(concat('main.js'))
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(gulp.dest(paths.dist.js))
    // .pipe(browserSync.stream());
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
    .src(paths.images, { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.images))
    .pipe(browserSync.stream());
}

function copySVG() {
  return gulp
    .src(paths.svg)
    .pipe(changed(paths.dist.svg))
    .pipe(rename((path) => {
      path.basename = path.basename.replace(/[^a-zA-Z0-9-_]/g, '');
      return path;
    }))
    .pipe(gulp.dest(paths.dist.svg));
}
function copyFonts() {
  return gulp
    .src(paths.fonts)
    .pipe(gulp.dest(paths.dist.fonts));
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

  gulp.watch(paths.styles, styles).on('change', browserSync.reload);;
  gulp.watch(paths.scripts, scripts).on('change', browserSync.reload);;
  gulp.watch(paths.pug, compilePug).on('change', browserSync.reload);;
  gulp.watch(paths.html, includeHTML).on('change', browserSync.reload);;
  gulp.watch(paths.images, images).on('change', browserSync.reload);
  gulp.watch(paths.svg, copySVG).on('change', browserSync.reload); 
  gulp.watch(paths.fonts, copyFonts).on('change', browserSync.reload); 
}


export {
  styles,
  scripts,
  compilePug,
  images,
  includeHTML,
  copySVG,
  copyFonts,
  format,
  serve,
};


export default gulp.series(
  gulp.parallel(styles, scripts, compilePug, includeHTML, images, copySVG),
  serve
);
