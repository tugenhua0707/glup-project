
var gulp = require('gulp');
var less = require('gulp-less');
var mincss = require('gulp-minify-css');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var clean = require('gulp-clean');

var browserify = require("browserify");
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var replace = require('gulp-str-replace');
var imagemin = require('gulp-imagemin');

//自动刷新     
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var fs = require('fs');
var fileContent = fs.readFileSync('./package.json');
var jsonObj = JSON.parse(fileContent);

var argv = process.argv.pop();
var DEBUGGER = (argv === "-D" || argv === "-d") ? true : false;

/* 基础路径 */
var paths = {
  css       :  'src/common/css/',
  less      :  'src/less/',
  scripts   :  "src/js/",
  img       :  "src/images/",
  html      :  "src/html/", 
  build     :  "build",
  src       :  'src' 
}
var resProxy = "项目的真实地址";
var prefix = "项目的真实地址"+jsonObj.name;

if(DEBUGGER) {
	resProxy = "http://localhost:3000/build";
	prefix = "http://localhost:3000/build";
}

// 先清理文件
gulp.task('clean-css',function(){
    return gulp.src(paths.build + "**/*.css")
             .pipe(clean());
});
gulp.task('testLess', ['clean-css'],function () {
  return gulp.src([paths.less + '**/*.less',paths.css+'**/*.css']) 
           .pipe(less())
           .pipe(concat('index.css'))
           .pipe(mincss())
           .pipe(replace({
      				original : {
      			      resProxy : /\@{3}RESPREFIX\@{3}/g,
      			      prefix : /\@{3}PREFIX\@{3}/g
      			    },
      			    target : {
      			      resProxy : resProxy,
      			      prefix : prefix
      			    }
      			}))
           .pipe(gulp.dest(paths.build + "/css"))
           .pipe(reload({stream:true}));
});

// 监听html文件的改变
gulp.task('html',function(){
    return gulp.src(paths.html + "**/*.html")
    	.pipe(replace({
			original : {
		      resProxy : /\@{3}RESPREFIX\@{3}/g,
		      prefix : /\@{3}PREFIX\@{3}/g
		    },
		    target : {
		      resProxy : resProxy,
		      prefix : prefix
		    }
		}))
      .pipe(gulp.dest(paths.build+'/html'))
      .pipe(reload({stream:true})); 
});
// 对图片进行压缩
gulp.task('images',function(){
   return gulp.src(paths.img + "**/*")
          .pipe(imagemin())
          .pipe(gulp.dest(paths.build + "/images"));
});
// 创建本地服务器，并且实时更新页面文件
gulp.task('browser-sync', ['testLess','html','browserify'],function() {
    var files = [
      '**/*.html',
      '**/*.css',
      '**/*.less',
      '**/*.js'
    ]; 
    browserSync.init(files,{
   
        server: {
            //baseDir: "./html"
        }
        
    });
});

// 解决js模块化及依赖的问题
gulp.task("browserify",function () {
    var b = browserify({
        entries: ["./src/js/index.js"],
        debug: true
    });
    return b.bundle()
        .pipe(source("index.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest("./build/js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(replace({
    			original : {
    		      resProxy : /\@{3}RESPREFIX\@{3}/g,
    		      prefix : /\@{3}PREFIX\@{3}/g
    		    },
    		    target : {
    		      resProxy : resProxy,
    		      prefix : prefix
    		    }
    		}))
        .pipe(gulp.dest("./build/js"))
        .pipe(reload({stream:true}));
});

gulp.task('default',['testLess','html','images','browserify'],function () {
    gulp.watch(["**/*.less","**/*.css"], ['testLess']);
    gulp.watch("**/*.html", ['html']);
    gulp.watch("**/*.js", ['browserify']);
});

gulp.task('server', ['browser-sync','images'],function () {
    gulp.watch(["**/*.less","**/*.css"], ['testLess']);
    gulp.watch("**/*.html", ['html']);
    gulp.watch("**/*.js", ['browserify']);
});
