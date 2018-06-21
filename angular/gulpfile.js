var gulp = require( 'gulp' );
var gutil = require('gulp-util');
//var argv = require('yargs').argv;
var del = require('del');
//var mv = require('mv');
//var mkdirp = require('mkdirp');
//var touch = require('touch');
//var ts = require("gulp-typescript");
var exec = require('child_process').exec;
var child_process = require('child_process')


function stringToBoolean(string){
  if(!string) {
    return false;
  }
  switch(string.toLowerCase()) {
    case "false": return false;
    case "no": return false;
    case "0": return false;
    case "": return false;
    case "true": return true;
    default:
      throw new Error("unknown string: " + string);
  }
}

//argv.skipTests = stringToBoolean(argv.skipTests);

/* TASKS */

gulp.task('clean', function(cb){
	  del(['./dist'], cb);
	  del(['./node_modules'], cb);
	  del(['ng'], cb);
	  del(['npm'], cb);
	  
});


gulp.task( 'build', function (cb) {
	  //exec('ng build --prod --build-optimizer', function (err, stdout, stderr) {
//	  exec('ng build', function (err, stdout, stderr) {
//		    console.log(stdout);
//		    console.log(stderr);
//		    cb(err);
//		  });
} );


gulp.task( 'test', function () {
  if(argv.skipTests) {
    gutil.log(gutil.colors.yellow('Skipping Tests'));
    return;
  }

    gutil.log('Running Tests');
} );

gulp.task('prepare-for-maven-war', function(){
  //return gulp.src('./build/**')
  //       .pipe(gulp.dest('target/gulp'));
});


gulp.task( 'publish', function () {
	
});
