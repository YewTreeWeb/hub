var plan = require('flightplan');

var config = {
  projectDir: '~/subdomains/hub',
  keepReleases: 5
};

var stageDeploy = {
  filesToCopy: [
    '_site/',
    '_site/areas/',
    '_site/blog/',
    '_site/css/',
    '_site/css/maps/',
    '_site/fonts/',
    '_site/images/',
    '_site/js/',
    '_site/js/maps/',
    '_site/posts/',
    '_site/posts/starter/',
    '_site/posts/test/',
    '_site/posts/testing/',
    '_site/subpages/',
  ],
  copyFiles: '_site/**/*'
}

var productionDeploy = {
  filesToCopy: '_site/build'
}

// configuration
plan.target( 'staging', [
  {
    host: 'shell.gridhost.co.uk',
    username: 'yewtreew1',
    port: 22,
    agent: process.env.SSH_AUTH_SOCK
  },
]);
plan.target( 'production', [
  {
    host: 'shell.gridhost.co.uk',
    username: 'yewtreew',
    port: 22,
    agent: process.env.SSH_AUTH_SOCK
  },
]);

plan.remote( function( remote ) {

  config.deployTo = config.projectDir + '/releases/' + ( new Date().getTime() );
  remote.log('Creating webroot');
  remote.exec( 'mkdir -p ' + config.deployTo );

});

// run commands on localhost
plan.local( function( local ) {

  // rsync files to all the destination's hosts
  if( plan.runtime.target === 'staging' ){
    var deploy = 'staging';
    var files = local.find('_site/', {silent: true});
    var indexFile = '_site/index.html';
    //var files = childFiles.concat(indexFile);

    //var copy = '_site/**/*';

    local.log( 'Deploying site folder to ' + deploy );
    local.transfer( files, config.deployTo + '/' );

  }
  if( plan.runtime.target === 'production' ){
    var deploy = 'production';
    var files = local.find('build/', {silent: true});

    var input = local.prompt( 'Are you sure you want to deploy to production? [yes]' );
    if( input.indexOf('yes') !== -1 ) {

      local.log( 'Running build' );
      local.exec( 'gulp build') ;
      local.log( 'Deploying built hub site to ' + deploy );
      local.transfer( productionDeploy.filesToCopy, config.deployTo + '/' );

    } else {

      plan.abort( 'Canceled flight' ); // this will stop the flightplan.

    }

  }

});

// Links current folder to new release folder and removes release folders if over 5
plan.remote( function( remote ) {

  remote.log( 'Linking to new release' );
  remote.exec( 'ln -nfs ' + config.deployTo + ' ' + config.projectDir + '/current' );

  remote.log( 'Checking for releases' );
  var releases = getReleases( remote );

  if ( releases.length > config.keepReleases ) {
    var removeCount = releases.length - config.keepReleases;
    remote.log( 'Removing ' + removeCount + ' release(s)' );

    releases = releases.slice( 0, removeCount );
    releases = releases.map(function ( item ) {
      return config.projectDir + '/releases/' + item;
    });

    remote.exec( 'rm -rf ' + releases.join( ' ' )) ;
  }

});

// Create releases function
function getReleases( remote ) {
  var releases = remote.exec( 'ls ' + config.projectDir +
    '/releases', {silent: true} );

  if ( releases.code === 0 ) {
    releases = releases.stdout.trim().split( '\n' );
    return releases;
  }

  return [];
}

// rollback site to previous delpoyed version
plan.remote( 'rollback', function( remote ) {

  remote.log( 'Rolling back to previous release' );
  var releases = getReleases( remote );
  if ( releases.length > 1 ) {
    var oldCurrent = releases.pop();
    var newCurrent = releases.pop();
    remote.log( 'Linking current to ' + newCurrent );
    remote.exec( 'ln -nfs ' + config.projectDir + '/releases/' + newCurrent + ' ' + config.projectDir + '/current' );

    remote.log( 'Removing ' + oldCurrent );
    remote.exec( 'rm -rf ' + config.projectDir + '/releases/' + oldCurrent );
  } else {

    plan.abort( 'There are no previous releases to rollback' );

  }

});

// Deletes all files within releases folder
plan.remote( 'clean', function( remote ) {

  var input = remote.prompt('Are you sure you want to remove all files? [yes]');
  if( input.indexOf( 'yes' ) !== -1 ) {

    var input = remote.prompt('Would you like a full clean or release clean? [f/r]');
    if( input.indexOf( 'f' ) !== -1 ) {

      remote.log( 'Cleaning up site files and folders' );
      remote.exec( 'rm -rf ' + config.projectDir + '/*' );

    } else if( input.indexOf( 'r' ) !== -1 ) {

      remote.log( 'Cleaning releases folder' );
      remote.exec( 'rm -rf ' + config.projectDir + '/releases/*' );

    }

  } else {
    plan.abort( 'Aborting clean' );
  }

});
