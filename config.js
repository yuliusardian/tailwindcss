module.exports = {
    tailwind: {
        config: "./tailwind.config"
    },
    browserSync: {
        port: 9001
    },
    del: [
        "./public/css",
        "./public/pages",
        "./public/*.html"
    ],
    pages: {
        index: {
            source: {
                html: "src/index.html",
                scss: "src/css/pages/home.scss",
                dest: "src/css/pages"
            },
            dist: {
                html: "public",
                css: {
                    dest: "public/css/pages",
                    name: "home.css"
                },
            }
        },
        a: {
            source: {
                html: "src/pages/a.html",
                scss: "src/css/pages/a.scss",
                dest: "src/css/pages"
            },
            dist: {
                html: "public/pages",
                css: {
                    dest: "public/css/pages",
                    name: "a.css"
                },
            }
        },
    },
}