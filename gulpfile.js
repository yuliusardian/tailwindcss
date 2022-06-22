const { src, dest, task, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postCss = require('gulp-postcss')
const concat = require('gulp-concat')
const del = require('del');
const browserSync = require('browser-sync').create()

const configs = require("./config")

let tailwindCss = require('tailwindcss')
let pages = configs.pages
let currentFileOnChange = null

function livePreview() {
    browserSync.init({
        server: {
            baseDir: "./public"
        },
        port: configs.browserSync.port || 2000
    })
}

function reloadLivePreview(done) {
    browserSync.reload({})
    done()
}

function css(done) {
    if (currentFileOnChange !== null) {
        src([
            currentFileOnChange.source.scss
        ], {})
            .pipe(sass({}, {}).on('error', sass.logError))
            .pipe(dest(currentFileOnChange.source.dest))
            .pipe(postCss([
                require('postcss-import'),
                tailwindCss({
                    content: [
                        currentFileOnChange.source.html,
                    ]
                }),
                require('cssnano'),
                require('autoprefixer'),
            ], {}))
            .pipe(concat({ path: currentFileOnChange.dist.css.name }))
            .pipe(dest(currentFileOnChange.dist.css.dest))
        done()
    }

    if (currentFileOnChange === null) {
        for (let page in pages) {
            src([
                pages[page].source.scss
            ], {})
                .pipe(sass({}, {}).on('error', sass.logError))
                .pipe(dest(pages[page].source.dest))
                .pipe(postCss([
                    require('postcss-import'),
                    tailwindCss({
                        content: [
                            pages[page].source.html,
                        ]
                    }),
                    require('cssnano'),
                    require('autoprefixer'),
                ], {}))
                .pipe(concat({path: pages[page].dist.css.name}))
                .pipe(dest(pages[page].dist.css.dest))
        }
        done()
    }
}

function html(done) {
    if (currentFileOnChange !== null) {
        src([
            currentFileOnChange.source.html
        ], {}).pipe(dest(currentFileOnChange.dist.html))
        done()
    }

    if (currentFileOnChange === null) {
        for (let page in pages) {
            src([
                pages[page].source.html
            ], {}).pipe(dest(pages[page].dist.html))
        }
        done()
    }
}

function watcher() {
    for (let page in pages) {
        currentFileOnChange = pages[page]

        watch(pages[page].source.html, series(css, html, reloadLivePreview)).on('change',
            function (path, stats) {
            // do magic.
        })
    }
}

function cleaner() {
    return del(configs.del);
}

exports.default = series(
    cleaner,
    parallel(livePreview, css, html, watcher),
)