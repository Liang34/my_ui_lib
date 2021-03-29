// build/gen-style.js
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const components = require('./components.json');

function buildCss(cb) {
    gulp.src('../styles/index.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename('index.css'))
        .pipe(gulp.dest('../lib/styles'));
    cb()
}

function buildSeperateCss(cb) {
    Object.keys(components).forEach(compName => {
        gulp.src(`../styles/${compName}.less`)
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(cleanCSS())
            .pipe(rename(`${compName}.css`))
            .pipe(gulp.dest('../lib/styles'));
    })

    cb()
}
exports.default = gulp.series(buildCss, buildSeperateCss);