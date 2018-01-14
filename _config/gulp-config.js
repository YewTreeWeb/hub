/*---------------
Gulp variables
---------------*/

// Styles
publicStyle  = './src/scss/style.scss',
adminStyle 	 = './src/scss/admin.scss',
styleURL     = './assets/css/',
// File maps
mapURL       = './maps',
// JS
jsSrc     	 = './src/js/',
jsFront      = 'main.js',
jsAdmin      = 'admin.js',
jsURL        = './assets/js/',
// Image
imgSRC       = './src/images/**/*',
imgURL       = './assets/images/',
// Fonts
fontsSRC     = './src/fonts/**/*',
fontsURL     = './assets/fonts/',
// Watch
styleWatch   = './src/scss/**/*.scss',
cssWatch     = './src/css/**/*.css',
jsWatch      = './src/js/**/*.js',
imgWatch     = './src/images/**/*.*',
fontsWatch   = './src/fonts/**/*.*',
phpWatch     = './**/*.php';

/*---------------
Gulp settings
---------------*/
const settings = {
	styleSrc: [
		publicStyle,
		adminStyle
	],
	jsFiles: [
		jsFront,
		jsAdmin
	],
	imgFiles: [
		imgSRC,
		'!./src/images/min/**/*'
	],
	browsers: [
		'last 15 versions',
		'>1%',
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
	legacyJS: [
		'./src/js/legacy/jquery-migrate-1.2.1.min.js',
		'./src/js/legacy/selectivizr-min.js',
		'./src/bower_components/html5shiv/dist/html5shiv.min.js',
		'./src/bower_components/respond/dest/respond.min.js'
	],
	bowerMove: [
		'./src/bower_components/jquery/dist/jquery.min.js'
	],
	preTasks: [
		'fonts',
		'images',
		'legacyJS'
	],
	concat: [
		'./assets/js/**/*.js',
		'./assets/css/**/*.css',
		'./src/bower_components/jquery-migrate/jquery-migrate.min.js',
		'!./assets/js/admin.min.js',
		'!./assets/js/customizer.js',
		'!./assets/css/admin.min.css',
		'!./assets/css/Kubix-Options.min.css',
		'!./assets/css/colours.min.css'
	],
	buildTasks: [
		'build:copy',
		'build:concat',
		'bower:move',
		'build:remove'
	],
	buildRemove: [
		'build/src/',
		'build/flightplan.js',
		'build/gulpfile.js',
		'build/node_modules/',
		'build/**/.DS_Store',
		'build/package.json',
		'build/bower.json',
		'build/**/bower_components/',
		'build/yarn.lock',
		'build/**/*.codekit'
	]
};
const syncOptions  = {
	server: {
		baseDir: '_site'
	},
	injectChanges: true,
	open: false
};
const imgMin = {
	optimizationLevel: 8,
	progressive: true,
	interlaced: true,
	svgoPlugins: [{cleanupIDs: false}]
};
const sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
}
const ruckOptions = {
	fallbacks: true
};
const messages = {
	build: 'Build task complete',
	concatJs: 'Combined all js files into one and added them to build/assets',
	concatCss: 'Combined all css files into one and added them to build/assets',
	moveJs: 'Moved all Bower JS files',
	moveCss: 'Moved all Bower CSS files'
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};
