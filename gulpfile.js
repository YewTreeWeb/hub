var gulp = require( 'gulp' ),
// Compile SCSS
sassdoc = require( 'sassdoc' )
sass = require( 'gulp-sass' ),
autoprefixer = require( 'gulp-autoprefixer' ),
rucksack = require( 'gulp-rucksack' ),
// CSS
minicss = require( 'gulp-minify-css' ),
csscomb = require( 'gulp-csscomb' ),
critical = require( 'critical' ),
// Compile JS
uglify = require( 'gulp-uglify' ),
babel  = require( 'gulp-babel' ),
// Compile HTML
pug = require( 'gulp-pug' ),
htmlmin = require( 'gulp-htmlmin' ),
// Add Source Maps to files
sourcemaps = require( 'gulp-sourcemaps' ),
// Compress Images
imagemin = require( 'gulp-imagemin' ),
cache = require( 'gulp-cache' ),
changed = require( 'gulp-changed' ),
// Detect changes and errors
plumber = require( 'gulp-plumber' ),
notify = require( 'gulp-notify' ),
// Rename files on compile
rename = require( 'gulp-rename' ),
// Build processes
replace = require( 'gulp-replace' ),
useref = require( 'gulp-useref' ),
concat = require( 'gulp-concat' ),
gulpif = require( 'gulp-if' ),
del = require( 'del' ),
// Reload Browser
browserSync = require( 'browser-sync' ),
reload = browserSync.reload,
// Jekyll
cp = require( 'child_process' );
jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/*---------------
Config
---------------*/
var config = {
  move: [
    '_bower/bower_components/jquery/dist/jquery.min.js',
    '_bower/bower_components/jquery-migrate/jquery-migrate.min.js',
    '_bower/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    '_bower/bower_components/animate.css/animate.css'
  ],
  browsers = [
    'last 15 versions',
    '> 1%',
    'ie >= 11',
    'ie_mob >= 10',
    'firefox >= 30',
    'Firefox ESR',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 9',
    'android >= 4.4',
    'bb >= 10'
  ],

};
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}
var ruckOptions = {
  fallbacks: true
}


/*---------------
Error notification
---------------*/
function handleErrors() {
  var args = Array.prototype.slice.call( arguments );

  // Send error to notification center with gulp-notify
  notify.onError( {
    title: "Compile Error",
    message: "<%= error %>"
  } ).apply( this, args );

  // Keep gulp from hanging on this task
  this.emit( 'end' );
}

/*---------------
Build the Jekyll site
---------------*/
gulp.task( 'jekyll-build', function ( done ) {
  browserSync.notify( messages.jekyllBuild );
  return cp.spawn( jekyll , [ 'build' ], { stdio: 'inherit' } )
  .on( 'close', done );
});

/*---------------
Rebuild Jekyll & do page reload
---------------*/
gulp.task( 'jekyll-rebuild', [ 'jekyll-build' ], function() {
  browserSync.reload();
} );

/**
* Wait for jekyll-build, then launch the Server
*/
gulp.task( 'browser-sync', [ 'sass', 'js', 'pug', 'jekyll-build' ], function() {
  browserSync( {
    server: {
      baseDir: '_site'
    }
  } );
} );

/*---------------
Sass
---------------*/
/**
* Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
*/

gulp.task( 'combscss', function(){
  return gulp.src(['_scss/**/*.scss'], {base: '_scss/'})
  .pipe( csscomb() )
  .pipe( gulp.dest( '_scss/' ) );
});

gulp.task( 'sass', function () {
  return gulp.src( '_scss/**/*.scss' )
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( sass( sassOptions ).on( 'error', handleErrors ) )
  .pipe( rucksack( ruckOptions ).on( 'error', handleErrors ) )
  .pipe( autoprefixer( , { cascade: true } ) )
  .pipe( csscomb() )
  .pipe( sourcemaps.write('maps') )
  .pipe( gulp.dest( '_site/css' ) )
  .pipe( reload( { stream:true } ) )
  .pipe( gulp.dest( 'css' ) );
});

gulp.task('critical', function (cb) {
    critical.generate({
        inline: true,
        base: 'dist/',
        src: 'index.html',
        dest: 'dist/index-critical.html',
        minify: true,
        width: 320,
        height: 480
    });
});

gulp.task( 'styles', [ 'sass', 'critical' ] );

/*---------------
JS
---------------*/
/**
* Compile files from js into both _site/js (for live injecting) and site (for future jekyll builds)
*/
gulp.task( 'js', function() {
  return gulp.src( [ 'js/**/*.js', '!js/**/*.min.js', '!js/**/*-min.js', '!js/bootstrap.js', '!js/bootstrap/*.js', '!js/bootstrap.min.js' ] )
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( babel().on( 'error', handleErrors ) )
  .pipe( sourcemaps.write('maps') )
  .pipe( gulp.dest( '_site/js' ) )
  .pipe( reload( { stream:true } ) )
  .pipe( gulp.dest( 'js' ) );
});

/*---------------
Images
---------------*/
gulp.task( 'image', function() {
  return gulp.src( 'images/**/*.+(png|jpg|jpeg|gif|svg)' )
  .pipe( plumber() )
  .pipe( changed( 'images' ) )
  .pipe( cache( imagemin( {
    progressive: true,
    interlaced: true,
    svgoPlugins: [ { cleanupIDs: false } ]
  } ) ).on( 'error', handleErrors ) )
  .pipe( gulp.dest( 'images' ) );
} );

/*---------------
Pug
---------------*/
gulp.task( 'pug', function(){
  return gulp.src( '_pug/*.pug' )
  .pipe( pug() )
  .pipe( gulp.dest( '_includes' ) )
  .pipe( reload( { stream:true } ) )
} )

/*---------------
Move Bower
---------------*/
gulp.task( 'bower:move', function() {
  return gulp.src( config.move )
  .pipe( gulpif( '*.js', gulp.dest( 'js' ) ) )
  .pipe( gulpif( '*.scss', gulp.dest( '_scss/assets' ) ) )
  .pipe( gulpif( '*.css', gulp.dest( 'css' ) ) )
} );

/*---------------
Watch
---------------*/
/**
* Watch files for changes & recompile
* Watch html/md files, run jekyll & reload BrowserSync
*/
gulp.task( 'watch', function () {
  gulp.watch( '_scss/**/*.scss', [ 'sass' ] );
  gulp.watch( 'js/**/*.js', [ 'js' ] );
  gulp.watch( '_pug/*.pug', [ 'pug' ] );
  gulp.watch( 'images/**/*.+(png|jpg|jpeg|gif|svg)', [ 'image' ] );
  gulp.watch( [ '_config.yml', '_data/navigation.yml', '*.html', '_layouts/*.html', '_posts/**/*', '_includes/*.html', 'areas/**/*.html', 'blog/*.html', '_subpages/**/*' ], [ 'jekyll-rebuild' ]);
} );

/*---------------
Build
---------------*/
/**
* Useref concats all files with a <!-- build tag
* Run the HTML min then complete the build
*/

gulp.task('sassdoc', function () {
  return gulp.src('_scss/**/*.scss')
    .pipe(sassdoc())
    .resume();
});

gulp.task( 'build:clean', function( cb ){
  return del( [ '_site/js', '_site/css' ] , cb );
} );

gulp.task( 'useref', function(){
  return gulp.src( '_includes/*.html' )
  .pipe( useref() )
  .pipe( gulpif( '*.js', uglify() ) )
  .pipe( gulpif( '*.css', cssnano() ) )
  .pipe( gulp.dest( 'build' ) );
} );
/*
gulp.task( 'build:copy', function(){
  return gulp.src( [ bowercss, bowerjs ] )
  .pipe( gulpif( '*.js', gulp.dest( '_site/js' ) ) )
  .pipe( gulpif( '*.css', gulp.dest( '_site/css' ) ) );
} );*/

gulp.task( 'build:cssmin', function(){
  return gulp.src( '_site/css/*.css' )
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( concat( 'main.css' ) )
  .pipe( csscomb().on( 'error', handleErrors ) )
  .pipe( minicss().on( 'error', handleErrors ) )
  .pipe( sourcemaps.write( 'maps') )
  .pipe( gulp.dest( '_site/css' ) );
} );

gulp.task( 'build:jsmin', function(){
  return gulp.src( '_site/js/main.js' )
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( uglify().on( 'error', handleErrors ) )
  .pipe( sourcemaps.write( 'maps') )
  .pipe( gulp.dest( '_site/js' ) );
} );*/

gulp.task( 'build:htmlmin', [ 'sassdoc', 'build:cssmin', 'build:jsmin' ], function(){
  return gulp.src( '_site/**/*.html' )
  .pipe( plumber() )
  .pipe( htmlmin( { collapseWhitespace: true } ).on( 'error', handleErrors ) )
  .pipe( gulp.dest( '_site' ) );
} );

gulp.task( 'build', [ 'useref', 'build:htmlmin' ] );

/**
* Default task, running just `gulp` will compile the sass, js, images, the jekyll site, launch BrowserSync & watch files.
*/
gulp.task( 'default', [ 'browser-sync', 'watch' ] );
