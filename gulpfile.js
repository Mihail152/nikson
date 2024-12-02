import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import pug from "gulp-pug";
import imagemin from "gulp-imagemin";
import browserSync from "browser-sync";
import fileInclude from "gulp-file-include";
import prettier from "gulp-prettier";
import { deleteAsync } from "del";
import changed from "gulp-changed";

const bs = browserSync.create();
const sass = gulpSass(dartSass);

const paths = {
  styles: "src/scss/**/*.scss",
  css: "src/css/**/*.css",
  scripts: "src/js/**/*.js",
  pug: "src/pug/**/*.pug",
  images: "src/images/**/*",
  svg: "src/svg/**/*",
  fonts: "src/fonts/**/*",
  html: "src/html/**/*.html",
  dist: {
    base: "dist",
    css: "dist/css",
    js: "dist/js",
    images: "dist/images",
    svg: "dist/svg",
    fonts: "dist/fonts",
  },
};

// Очистка папки dist
export const clean = () => deleteAsync([paths.dist.base]);

// Компиляция SCSS
export const styles = () =>
  gulp
    .src(paths.styles)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(cleanCSS({ level: 1 }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(bs.stream());

// Перенос CSS
export const css = () => gulp.src(paths.css).pipe(gulp.dest(paths.dist.css));

// Компиляция JS
export const scripts = () =>
  gulp
    .src(paths.scripts)
    .pipe(gulp.dest(paths.dist.js))
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(bs.stream());

// Компиляция PUG
export const pugCompile = () =>
  gulp
    .src(paths.pug)
    .pipe(changed(paths.dist.base, { extension: '.html' }))  // Ensure we only process changed files
    .pipe(
      pug({ pretty: true }).on("error", (err) => {
        console.error(err);
        this.emit("end");
      })
    )
    .pipe(gulp.dest(paths.dist.base))
    .pipe(bs.stream());

// Оптимизация изображений
export const images = () =>
  gulp.src(paths.images).pipe(imagemin()).pipe(gulp.dest(paths.dist.images));

// Перенос SVG
export const copySVG = () => gulp.src(paths.svg).pipe(gulp.dest(paths.dist.svg));

// Перенос шрифтов
export const copyFonts = () =>
  gulp.src(paths.fonts).pipe(gulp.dest(paths.dist.fonts));

// Обработка HTML
export const includeHTML = () =>
  gulp
    .src(paths.html)
    .pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
    .pipe(gulp.dest(paths.dist.base))
    .pipe(bs.stream());

// Локальный сервер
// Локальный сервер
export const serve = () => {
  bs.init({
    server: { baseDir: paths.dist.base },
    notify: false,
    open: true,
    reloadDebounce: 500,
  });

  gulp.watch(paths.styles, gulp.series(styles));
  gulp.watch(paths.css, gulp.series(css));
  gulp.watch(paths.scripts, gulp.series(scripts));
  gulp.watch(paths.pug, gulp.series(pugCompile));
  gulp.watch(paths.images, gulp.series(images));
  gulp.watch(paths.svg, gulp.series(copySVG));
  gulp.watch(paths.fonts, gulp.series(copyFonts));
  gulp.watch(paths.html, gulp.series(includeHTML));
};


// Сборка проекта
export const build = gulp.series(
  clean,
  gulp.parallel(styles, css, scripts, pugCompile, images, copySVG, copyFonts, includeHTML)
);

// Задача по умолчанию
export default gulp.series(build, serve);
