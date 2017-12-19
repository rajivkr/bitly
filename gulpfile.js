var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 1000;
const JS_PATH = 'public/**/*.js';
const CSS_PATH = 'public/*.css';
const HTML_PATH = 'public/*.html';

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({

        // nodemon our expressjs server
        script: 'server/server.js',

        // watch core server file(s) that require server restart on change
        watch: ['*.js']
    })
        .on('start', function onStart() {
            // ensure start only got called once
            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {
            // reload connected browsers after a slight delay
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
});

gulp.task('browser-sync', ['nodemon'], function () {

    // for more browser-sync config options: http://www.browsersync.io/docs/options/
    browserSync({

        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'http://localhost:3000',

        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port: 4000,
    });
});

gulp.task('js', function () {
    return gulp.src(JS_PATH)
    // do stuff to JavaScript files
    //.pipe(uglify())
    //.pipe(gulp.dest('...'));
});

gulp.task('css', function () {
    return gulp.src(CSS_PATH)
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('bs-reload', function () {
    console.log('Trying to reload!!');
    browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(JS_PATH, ['js', browserSync.reload]);
    gulp.watch(CSS_PATH, ['css']);
    gulp.watch(HTML_PATH, ['bs-reload']);
});