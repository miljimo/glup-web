
"use strict"
var path      = require("path")
var gulp      = require('gulp');
var sass      = require('gulp-sass');
var cssMinify = require('gulp-clean-css');
var newer     = require('gulp-newer');
var htmlmin   = require('gulp-htmlmin');
var cleanup   = require("gulp-cleanup");
var cssConcat = require('gulp-concat-css');
var jsminify  = require('gulp-uglify');
var pump      = require('pump');

const SRC_DIR  = path.resolve(__dirname + "/src");
const DEST_DIR = path.resolve(__dirname + '/bin');
const HTML_SRC = path.resolve(SRC_DIR+'/html/**/*.html');
const JS_SRC   = path.resolve(SRC_DIR+"/scripts/**/*.js");
const SASS_SRC = path.resolve(SRC_DIR +"/styles/**/*.scss");


//@brief
// The task runner for sass bundle
gulp.task("sass-compiler",(function()
{
   var compile = gulp.src(SASS_SRC)
                     .pipe(newer(DEST_DIR +"/styles/"))
                     .pipe(sass())
                     .pipe(cssConcat('bundle.css'))
                     .pipe(gulp.dest(DEST_DIR+'/styles'));

    return compile;

}));


gulp.task('css-minified',['sass-compiler'], (function()
{
  return  gulp.src(DEST_DIR+'/styles/css/**/*.css')
              .pipe(cssConcat("bundle.minified.css"))
              .pipe(cssMinify({compatibility: 'ie8'}))
              .pipe(gulp.dest(DEST_DIR+'/styles'))
}));

gulp.task('sass',['css-minified'], (function()
{
    console.log("CSS files generated for used.");
}));

gulp.task('html_clean', (function()
{
  var compiler  = gulp.src(HTML_SRC,{read: false})
                      .pipe(cleanup())
                      .pipe(gulp.dest(DEST_DIR));
  return compiler;
}))
//Get and minified the html to the bin directory as the component and pages.
gulp.task('html', ["html_clean"] , (function()
{
    //html minified
    var compiler =  gulp.src(HTML_SRC)
                        .pipe(newer(DEST_DIR))
                        .pipe(htmlmin({collapseWhitespace:true}))
                        .pipe(gulp.dest(DEST_DIR));

   //if your return compiler task that will make gulp wait for the task

   return compiler;
}))


gulp.task('js-compress', (function(cb)
{
  pump([
       gulp.src(JS_SRC),
       jsminify(),
       gulp.dest(DEST_DIR+'/scripts')
   ],
   cb
 );

}));

gulp.task("all", ["html", "sass", 'js-compress']);

gulp.task('watch', (function()
{
    gulp.watch(SASS_SRC, ["sass-compiler","css-minified"]);
    gulp.watch(JS_SRC, ['js-compress']);
    gulp.watch(HTML_SRC,['html']);

}))
