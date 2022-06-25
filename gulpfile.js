const { src, dest, task, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postCss = require('gulp-postcss')
const concat = require('gulp-concat')
const del = require('del');
const browserSync = require('browser-sync').create()
const nunjucks = require("gulp-nunjucks")
const nunjucksLib = require('nunjucks')

const configs = require("./config")

let tailwindCss = require('tailwindcss')
let pages = configs.pages
let currentFileOnChange = null

let nunjucksEnv = new nunjucksLib.Environment(new nunjucksLib.FileSystemLoader('src', {}));

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
                        `${currentFileOnChange.dist.html.dest}/${currentFileOnChange.dist.html.name}`
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
                            `${pages[page].dist.html.dest}/${pages[page].dist.html.name}`,
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
        ], {}).pipe(nunjucks.compile(
            // passing data into compiler defined at config.js
            currentFileOnChange.nunjucks, {
                env: nunjucksEnv
            }
        )).pipe(dest(currentFileOnChange.dist.html.dest))
        done()
    }

    if (currentFileOnChange === null) {
        for (let page in pages) {
            src([
                pages[page].source.html
            ], {}).pipe(nunjucks.compile(
                // passing data into compiler defined at config.js
                pages[page].nunjucks, {
                    env: nunjucksEnv
                }
            )).pipe(dest(pages[page].dist.html.dest))
        }
        done()
    }
}

function watcher() {
    for (let page in pages) {
        watch(pages[page].source.html, {}, series(css, html, reloadLivePreview)).on('change', function (path, stats) {
            // do magic.
            console.log(`HTML File ${path} has been changed`)
            currentFileOnChange = pages[page]
        })
    }

    watch([
        "./src/partial/**/*.html",
    ], {}, series(css, html, reloadLivePreview)).on('change', function (path, stats) {
        console.log(`Partial HTML File ${path} has been changed`)
    })

    watch([
        "./src/css/**/*.scss",
    ], {}, series(css, html, reloadLivePreview)).on('change', function (path, stats) {
        console.log(`CSS File ${path} has been changed`)
    })

    watch([
        "./src/js/**/*.js",
    ], {}, series(css, html, reloadLivePreview)).on('change', function (path, stats) {
        console.log(`JS File ${path} has been changed`)
    })
}

function cleaner() {
    return del(configs.del);
}

exports.default = series(
    cleaner,
    parallel(livePreview, css, html, watcher),
)