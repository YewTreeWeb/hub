var plan = require('flightplan');

var config = {
  projectDir: '~/subdomains/hub',
  releaseDir: '~/subdomains/deploy',
  keepReleases: 5
};

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

// Creates release folder
plan.remote( function( remote ) {

  config.deployTo = config.releaseDir + '/releases/' + ( new Date().getTime() );
  remote.log('Creating webroot');
  remote.exec( 'mkdir -p ' + config.deployTo );

});

// run commands on localhost
plan.local( function( local ) {

  // rsync files to all the destination's hosts
  if( plan.runtime.target === 'staging' ){
    var deploy = 'staging';
    var files = local.find( '_site/', {silent: true} );

    local.log( 'Deploying site folder to ' + deploy );
    local.transfer( files, config.deployTo + '/' );

  }
  if( plan.runtime.target === 'production' ){
    var deploy = 'production';

    var input = local.prompt( 'Are you sure you want to deploy to production? [yes]' );
    if( input.indexOf('yes') !== -1 ) {

      local.log( 'Running build' );
      local.exec( 'gulp build') ;
      local.log( 'Build complete' );

      var files = local.find( 'build/', {silent: true} );
      local.log( 'Deploying built hub site to ' + deploy );
      local.transfer( files, config.deployTo );

    } else {

      plan.abort( 'Canceled flight' ); // this will stop the flightplan.

    }

  }

});

//moves files out of _site folder, then moves .htaccess out of htaccess folder and removes both parent folders
plan.remote( function( remote ) {
  remote.exec( 'mv -v' + ' ' + config.deployTo +  '/_site/*' + ' ' + config.deployTo, {silent: true} );
  remote.exec( 'rm -rf' + ' ' + config.deployTo + '/_site');
});

// Links current folder to new release folder and removes release folders if over 5
plan.remote( function( remote ) {

  remote.log( 'Linking to new release' );
  remote.exec( 'ln -nfs ' + config.deployTo + ' ' + config.projectDir + '/site' );

  remote.log( 'Checking for releases' );
  var releases = getReleases( remote );

  if ( releases.length > config.keepReleases ) {
    var removeCount = releases.length - config.keepReleases;
    remote.log( 'Removing ' + removeCount + ' release(s)' );

    releases = releases.slice( 0, removeCount );
    releases = releases.map(function ( item ) {
      return config.releaseDir + '/releases/' + item;
    });

    remote.exec( 'rm -rf ' + releases.join( ' ' ) ) ;
  }

});

// Create releases function
function getReleases( remote ) {
  var releases = remote.exec( 'ls ' + config.releaseDir +
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
    remote.exec( 'ln -nfs ' + config.releaseDir + '/releases/' + newCurrent + ' ' + config.projectDir + '/site' );

    remote.log( 'Removing ' + oldCurrent );
    remote.exec( 'rm -rf ' + config.releaseDir + '/releases/' + oldCurrent );
  } else {

    plan.abort( 'There are no previous releases to rollback' );

  }

});

// Deletes all files within releases folder or release and subdomain folder
plan.remote( 'clean', function( remote ) {

  var input = remote.prompt('Are you sure you want to remove all files? [yes]');
  if( input.indexOf( 'yes' ) !== -1 ) {

    var input = remote.prompt('Would you like a full clean or release clean? [f/r]');
    if( input.indexOf( 'f' ) !== -1 ) {

      remote.log( 'Cleaning up site files and folders' );
      remote.exec( 'rm -rf ' + config.releaseDir + '/*' );
      remote.exec( 'rm -rf ' + config.projectDir + '/*' );

    } else if( input.indexOf( 'r' ) !== -1 ) {

      remote.log( 'Cleaning releases folder' );
      remote.exec( 'rm -rf ' + config.releaseDir + '/releases/*' );

    }

  } else {
    plan.abort( 'Aborting clean' );
  }

});
