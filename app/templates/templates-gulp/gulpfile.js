var gulp = require('gulp'), // gulp模块
    fileinclude = require('gulp-file-include'), // 模版分离
    spritesmith=require('gulp.spritesmith'), //制作雪碧图插件
    sass = require("gulp-sass"), //sass的编译
    autoprefixer = require("gulp-autoprefixer"), //css 浏览器前缀补全
    cleanCss = require('gulp-clean-css'); // 压缩 css
    uglify = require("gulp-uglify"), // js文件压缩
    imagemin = require('gulp-imagemin'),//压缩图片
    // imageminJpegRecompress = require('imagemin-jpeg-recompress'),//处理图片
    cache = require('gulp-cache'), // 图片缓存，图片替换了才压缩
    del = require('del'), // 文件删除
    notify = require('gulp-notify'), // 提示
    util = require('gulp-util'), // 基础的工具
    runSequence = require('run-sequence'), // 设定同步异步执行任务
    browserSync = require('browser-sync').create(), //自动刷新
    reload = browserSync.reload,
    fs = require("fs");

// 配置
var options={
    del:'./dist/**/*',// 删除文件
    index:'demo.html', // 文件入口
    port:8081, // 端口
    dist:'./dist/**/*.*',// 监听编译生成的文件夹所有文件
};

//配置文件路径
var paths={
    //src_变量开头的是源文件的文件目录
    src_html:"src/html/*.html",// 需要生成到编译文件的html
    src_all_html:"src/html/**/*.html", // 监听所有的html触发刷新
    src_sprite_img:"src/img/sprite/*.png", // 需要生成雪碧图的地址
    src_scss:"src/css/*.scss",//需要编译的scss文件
    src_all_scss:"src/css/**/*.scss",// 监听所有的scss文件
    src_img:"src/img/*.png", // 需要生成到编译文件的img
    src_js:"src/js/**/*.js",
    //dist_变量开头的都是编译过后的文件目录
    dist:"dist", // 生成到编译文件根目录
    dist_css:"dist/css",// 生成css的地址
    dist_img:"dist/img", // 生成img的地址
    dist_js:"dist/js",
};

// 清空文件夹
gulp.task('del', (cb) => {
    return del([options.del], cb);
});

// page任务
gulp.task('page', function() {  //编译html文件
    return gulp.src([paths.src_html])
        .pipe(fileinclude({
            prefix: '@@', // 变量前缀
            basepath: '@file', // 引用文件路径
        }))
        .pipe(gulp.dest(paths.dist))//输出到指定文件夹
        .pipe(notify({ message: 'page is OK' }))//提醒任务完成
        .pipe(reload({stream: true}));
});

//雪碧图
gulp.task('sprite',function(){
    gulp.src([paths.src_sprite_img])
        .pipe(spritesmith({
            imgName:'sprite.png',
            cssName:'sprite.css',
            padding:5,
            algorithm:'binary-tree'
        }))
        .on('error', function (err) {
            console.log(err);
        })
        .pipe(gulp.dest('./src/img/')); //输出目录
});

//style任务
gulp.task('style',function(){
    gulp.src([paths.src_scss])
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))//sass的编译
        .pipe(autoprefixer({
            browsers: [
                'ie >= 9',
                'ie_mob >= 10',
                'ff >= 30',
                'chrome >= 34',
                'safari >= 7',
                'opera >= 23',
                'ios >= 7',
                'android >= 4.4',
                'bb >= 10'
            ],
            cascade: true,
            remove: true
        }))
        .pipe(cleanCss({
            compatibility: 'ie8',
            keepSpecialComments: '*'
        }))
        .pipe(gulp.dest(paths.dist_css))//然后输出编译文件到指定文件夹
        .pipe(notify({ message: 'style is OK' })) //提醒任务完成
        .pipe(reload({stream: true}));
});

//image任务
gulp.task('image',function(){
    return gulp.src([paths.src_img])
        .pipe(cache(imagemin({
            progressive: true,
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(paths.dist_img)) //输出到指定文件夹
        .pipe(notify({ message: 'image is OK' })) //提醒任务完成
        .pipe(reload({stream: true}));
});

//script任务
gulp.task('script',function(){
    return gulp.src([paths.src_js])
        .pipe(uglify({
            mangle: true, // 类型：Boolean 默认：true 是否修改变量名
            compress: true, // 类型：Boolean 默认：true 是否完全压缩
            ie8: true,
        }))  //使用uglify进行压缩
        .on('error', function (err) {
            util.log(util.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest(paths.dist_js)) //输出到指定文件夹
        .pipe(notify({ message: 'script is OK' })) //提醒任务完成
        .pipe(reload({stream: true}));
});

//静态服务器
gulp.task('server',function(){
    browserSync.init({      // 启动Browsersync服务
        server: {
            baseDir: paths.dist, //这里指的是根目录，如果你的index.html在根目录下，会直接打开index页面，不然会显示Get Not，自己写路径就行
            index: options.index  // 自定义启动文件名
        },
        port: options.port,  //默认打开localhost:3000,现在改成localhost:8081
        open: 'external',   // 决定Browsersync启动时自动打开的网址 external 表示 可外部打开 url, 可以在同一 wifi 下不同终端测试
        injectChanges: true // 注入CSS改变
    });

    // 监听文件变化，执行相应任务
    gulp.watch([paths.src_all_html],['page']);
    gulp.watch([paths.src_sprite_img],['sprite']);
    gulp.watch([paths.src_all_scss],['style']);
    gulp.watch([paths.src_img],['image']);
    gulp.watch([paths.src_js],['script']);
    gulp.watch([options.dist]).on('change',reload);
});

//编译,清空 /dist 文件夹，将 html、编译后的css、编译后的js、图片引入
// [] 中任务是并行的，其他按照先后顺序执行
gulp.task('dev', (cb) => {
    runSequence('del', 'page', 'sprite','style','image','script',['server'],cb);
});