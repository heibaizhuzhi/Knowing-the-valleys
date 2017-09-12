var gulp =require("gulp");//导入gulp包
var htmlmin =require("gulp-htmlmin");//导入html压缩包
var uglify = require("gulp-uglify");//导入js压缩包
var less = require("gulp-less")//导入less包
var cleanCss = require("gulp-clean-css");//压缩css
var rename = require("gulp-rename");//文件重命名
var concat =require("gulp-concat");//合并js
var browserify= require("browserify");//使代码能同时运行于服务端和浏览器端。
var source = require("vinyl-source-stream");//转换为vinyl对象
var buffer = require("vinyl-buffer");//这个是把vinyl对象文件中的数据转为buffer方式存储
var htmlReplace =require("gulp-html-replace");//提取公共的html样式，用HTML替换构建块；

//html处理
gulp.task("html",function(){
    gulp.src(["src/**/*.html","index.html"])
    //提取公共的html
        .pipe(htmlReplace({
            style:gulp.src("src/html/common/style.html"),//提取后的路径
            aside:gulp.src("src/html/common/aside.html"),
            header:gulp.src("src/html/common/header.html")
        }))
        .pipe(htmlmin({
            collapseWhitespace:true,//去处空白字符
            minifyCSS:true,//压缩css
            minifyJS:true,//压缩js
            removeComments:true//清除HTML注释
        }))
        .pipe(gulp.dest("dist"));
});

//lsee处理
gulp.task("less",function(){
    gulp.src("src/less/index.less")
        .pipe(less())//转换为css
        .pipe(cleanCss())//压缩css
        .pipe(gulp.dest("dist/css"));
});

//配置要打包的第三包路径
var jsLibs = [
    'node_modules/art-template/lib/template-web.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/jquery-form/dist/jquery.form.min.js'
];
// 合并所有的第三方包为一个js
gulp.task("jsLibs",function(){
    gulp.src(jsLibs)
        .pipe(concat("lib.js"))//合并文件
        .pipe(gulp.dest("dist/js"))
});

var jsModules = [
    // 首页
    'src/js/index.js',
    // 用户
    'src/js/user/login.js',
    'src/js/user/repass.js',
    'src/js/user/profile.js',
    // 讲师
    'src/js/teacher/add.js',
    'src/js/teacher/edit.js',
    'src/js/teacher/list.js',
    // 课程
    'src/js/course/add.js',
    'src/js/course/edit1.js',
    'src/js/course/edit2.js',
    'src/js/course/edit3.js',
    'src/js/course/list.js',
    // 学科分类
    'src/js/category/add.js',
    'src/js/category/edit.js',
    'src/js/category/list.js'
];
//处理js
gulp.task("js",function(){
    jsModules.forEach(function(jsPath){
        var pathArr =jsPath.split("/");
        var jsName =pathArr.pop();
        pathArr.shift();
        browserify(jsPath,{debug:true}).bundle()
            .pipe(source(jsName))//转换为vinyl对象
            .pipe(buffer())//把vinyl对象文件中的数据转为buffer方式存储
            .pipe(gulp.dest("dist/"+pathArr.join("/")));
    });
});

//添加统一打包任务
gulp.task("build",function(){
    gulp.run(["html","less","jsLibs","js"]);
});

//监听文件变化，自动打包
gulp.task("default",function(){
    gulp.run("build");
    gulp.watch(['src/**/*.html',"index.html"],function(){
        gulp.run("html");
    });
    gulp.watch(["src/**/*less"],function(){
        gulp.run("less");
    });
    gulp.watch(["src/**/*.js"],function(){
        gulp.run("js");
    })
});