# Tailwindcss + Nunjucks + Gulp Development Starter Kit

Tailwindcss + Nunjucks + Gulp Development Starter Kit, speed up your development process with predefined gulp task.
The gulp task will be generated page and css based on mapping ```pages``` object in ```config.js``` file. 
So each page will have their own css.

# Benefit

Since each page will have their own css file so there is no more unused css and yeah the benefit is your website will be load faster
but this only from one aspect and there is more to work around with such as image optimize, server optimize, etc.

# Requirements 

- NodeJS > v12
- NPM > 6

# Installation

Just run this command in root project directory

```bash
$ npm install
```

# Configuration

Mapping your page at ```pages``` object in ```config.js``` file, example :

    my: {
        source: {
            html: "src/my.html",
            scss: "src/css/pages/my.scss",
            dest: "src/css/pages"
        },
        dist: {
            html: "public",
            css: {
                dest: "public/css/pages",
                name: "my.css"
            },
        }
        nunjucks: {
            title: "My Title"
        }
    },

and don't forget to create the scss file and html. Finally, run this command :

```bash
$ gulp
```

Happy coding. :)