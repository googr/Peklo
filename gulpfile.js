var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var browserSync = require('browser-sync').create();

var conf = {
    localServer: 'neklo.loc',
    sass: {
        watch: './sass/**/*.scss',
        watchCss: './css/**/*.css',
        libSass: './sass/**/*.scss',
        css: './css',
        map: './'
    },
    templatesPath: '../../../../app/design/frontend/**/**/*.phtml',
    sprite: {
        rootSprite: "images/sprite/*.png",
        imagesSprite: "./images",
        cssSprite: "./sass/sprite"
    }
};

// ==============
// sprite
// ==============
gulp.task('sprite', function () {
    var spriteData = gulp.src(conf.sprite.rootSprite).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        padding: 5,
        cssTemplate: 'handlebarsStr.css.handlebars'
    }));

    spriteData.img.pipe(gulp.dest(conf.sprite.imagesSprite));
    spriteData.css.pipe(gulp.dest(conf.sprite.cssSprite));
});

// ==============
// sass
// ==============
gulp.task('sass', function () {
    gulp.src(conf.sass.libSass)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: ['last 100 version'] }) ]))
        .pipe(gulp.dest(conf.sass.css))
        .pipe(browserSync.reload({stream: true}));
});

// ==============
// browser-sync
// ==============
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: {
            target: conf.localServer
        },
        open: false,
        ghostMode: {
            scroll: false,
            click: false
        }
    });
});

// ==============
// watch
// ==============
gulp.task('watch', function() {
    gulp.watch(conf.templatesPath).on('change', browserSync.reload);
    gulp.watch(conf.sass.watch, ['sass']);
    gulp.watch(conf.sprite.rootSprite, ['sprite']);
});

// ==============
// default
// ==============
gulp.task('default', ['browser-sync', 'sass', 'watch', 'sprite']);

// ==============
// build
// ==============
gulp.task('sass-build', function () {
    gulp.src(conf.sass.libSass)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: ['last 100 version'] }) ]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(conf.sass.css))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build', ['sass-build']);
