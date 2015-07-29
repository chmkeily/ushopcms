var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
	less = require('gulp-less');
    
gulp.task('minifyjs', function(cb){
	gulp.src('../js/*.js') //js 源文件
		.pipe(uglify())  //压缩
        .pipe(gulp.dest('../js/jsmin/'));  //输出到目标目录
	setTimeout(cb, 1000);
});

gulp.task('build-less', function(cb){
	gulp.src('./less/*.less') //less 源文件
		.pipe(less({compress: false}))  //编译less成css并压缩文件
		.pipe(gulp.dest('../css/orange/'));//输出到目标目录
	setTimeout(cb, 1000);
});

/*
gulp.task('default', function() {
	gulp.watch('./less/*.less', ['build-less']);//监听文件变化
});
*/
