var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');//引入此插件正常写依赖注入，压缩时不会出问题
var ngHtml2js = require('gulp-ng-html2js');//把所有的html模板合并存储到一个js当中

gulp.task('default', [
    "htmlView",
    "htmlOthers",
    "bowerCss",
    "downBowerCss",
    "mainCss",
    "mediaCss",
    "es5-json3",
    "bowerJs",
    "js",
    "modules",
    "template"
], function () {
    //图片压缩
    // gulp.src(['./app/images/*.png', './app/images/*.jpg'])
    //     .pipe(imagemin())
    //     .pipe(gulp.dest('./dist/app/images'));
});
//angularhtml模板
gulp.task('htmlView', function () {
     gulp.src('./app/modules/**/views/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,//去掉空格
            minifyJS: true,  //压缩js
            removeComments: true//去掉注释
        }))
        .pipe(gulp.dest('./dist/app/html'));
});

//angular的模板页面合成js文件

gulp.task('template', function () {
     gulp.src('./app/modules/**/views/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,//去掉空格
            minifyJS: true,  //压缩js
            removeComments: true//去掉注释
        }))
        .pipe(ngHtml2js({
            moduleName: 'template-app'
        }))
        .pipe(concat('template.js'))
        .pipe(gulp.dest('./dist/app/template'));
});
 

//其他页面
gulp.task('htmlOthers', function () {
     gulp.src('./app/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,//去掉空格
            minifyJS: true,  //压缩js
            removeComments: true//去掉注释
        }))
        .pipe(gulp.dest('./dist/htmlOthers'));
});

//bower下的css
gulp.task('bowerCss',function () {
    gulp.src([
        "./app/bower_components/bootstrap/dist/css/bootstrap.css",
        "./app/bower_components/font-awesome/css/font-awesome.css",
        "./app/bower_components/angular-toasty/dist/angular-toasty.min.css",
        "./app/bower_components/sweetalert/dist/sweetalert.css",
        "./app/bower_components/ionicons/css/ionicons.css",
        "./app/bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css",
        "./app/bower_components/codemirror/lib/codemirror.css",
        "./app/bower_components/codemirror/theme/monokai.css",
        "./app/bower_components/angular-ui-grid/ui-grid.css",
        "./app/bower_components/flag-icon-css/css/flag-icon.min.css",
        "./app/bower_components/angular-loading-bar/build/loading-bar.css",
        "./app/bower_components/angular-ui-switch/angular-ui-switch.min.css",
        "./app/bower_components/summernote/dist/summernote.css"
    ])
        //压缩css
        .pipe(cssnano())
        .pipe(concat('bowerCss.css'))
        .pipe(gulp.dest('./dist/Css'));
});
//down.html的bowerCss
gulp.task("downBowerCss",function(){
    gulp.src([
        "./app/bower_components/bootstrap/dist/css/bootstrap.css",
        "./app/bower_components/font-awesome/css/font-awesome.css",
        "./app/bower_components/sweetalert/dist/sweetalert.css",
        "./app/bower_components/ionicons/css/ionicons.css",
        "./app/bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css",
        "./app/bower_components/codemirror/lib/codemirror.css",
        "./app/bower_components/codemirror/theme/monokai.css",
        "./app/bower_components/flag-icon-css/css/flag-icon.min.css",
        './app/bower_components/summernote/dist/summernote.css'
        ])
    .pipe(concat("downBowerCss.css"))
    .pipe(gulp.dest("./dist/downBowerCss"))
})
//css文件夹的css,media.css除外
gulp.task("mainCss",function(){
    gulp.src([
         "./app/css/all.css",
        "./app/css/main.css",
        ])
    .pipe(concat("main.css"))
    .pipe(gulp.dest("./dist/Css"))
})
gulp.task("mediaCss",function(){
    gulp.src("./app/css/media.css")
    .pipe(gulp.dest("./dist/Css"))
})
//--------------js部分-----------------
//小于ie9兼容性js
gulp.task('es5-json3',function () {
    gulp.src([
        "./app/bower_components/es5-shim/es5-shim.js",
        "./app/bower_components/json3/lib/json3.js"
    ])
    //全部合起来的js名称
        // .pipe(uglify())
        .pipe(concat('es5Json3.js'))
        .pipe(gulp.dest('./dist/es5Json3'));
});
//bower文件夹
gulp.task('bowerJs',function () {
    gulp.src([
        "./app/bower_components/jquery/dist/jquery.js",
        "./app/bower_components/angular/angular.js",
        "./app/bower_components/bootstrap/dist/js/bootstrap.js",
        "./app/bower_components/angular-resource/angular-resource.js",
        "./app/bower_components/angular-cookies/angular-cookies.js",
        "./app/bower_components/angular-route/angular-route.js",
        "./app/bower_components/angular-sanitize/angular-sanitize.js",
        "./app/bower_components/angular-animate/angular-animate.js",
        "./app/bower_components/angular-touch/angular-touch.js",
        "./app/bower_components/angular-ui-router/release/angular-ui-router.js",
        "./app/bower_components/api-check/dist/api-check.min.js",
        "./app/bower_components/angular-formly/dist/formly.min.js",
        "./app/bower_components/angular-toasty/dist/angular-toasty.min.js",
        "./app/bower_components/angular-file-upload/dist/angular-file-upload.min.js",
        "./app/bower_components/angular-filter/dist/angular-filter.js",
        "./app/bower_components/sweetalert/dist/sweetalert.min.js",
        "./app/bower_components/angular-sweetalert/SweetAlert.js",
        "./app/bower_components/angular-gravatar/build/angular-gravatar.min.js",
        "./app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
        "./app/bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js",
        "./app/bower_components/codemirror/lib/codemirror.js",
        "./app/bower_components/codemirror/addon/mode/overlay.js",
        "./app/bower_components/codemirror/mode/gfm/gfm.js",
        "./app/bower_components/codemirror/mode/markdown/markdown.js",
        "./app/bower_components/angular-ui-codemirror/ui-codemirror.js",
        "./app/bower_components/showdown/compressed/Showdown.min.js",
        "./app/bower_components/angular-markdown-directive/markdown.js",
        "./app/bower_components/angular-elastic/elastic.js",
        "./app/bower_components/angular-autoFields-bootstrap/autofields.min.js",
        "./app/bower_components/angular-autoFields-bootstrap/autofields-bootstrap.min.js",
        "./app/bower_components/angular-gettext/dist/angular-gettext.js",
        "./app/bower_components/angular-translate/angular-translate.js",
        "./app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
        "./app/bower_components/angular-translate-loader-url/angular-translate-loader-url.js",
        "./app/bower_components/angular-ui-grid/ui-grid.js",
        "./app/bower_components/angular-loading-bar/build/loading-bar.js",
        "./app/bower_components/Faker/build/build/faker.js",
        "./app/bower_components/angular-mocks/angular-mocks.js",
        "./app/bower_components/angular-scenario/angular-scenario.js",
        "./app/bower_components/echarts/build/dist/echarts-all.js",
        "./app/bower_components/iu-echarts/src/iuChart.js",
        "./app/bower_components/angular-ui-switch/angular-ui-switch.min.js",
        "./app/bower_components/angular-baidu-map/baiduMap.min.js",
        "./app/bower_components/summernote/dist/summernote.min.js",
        "./app/bower_components/summernote/dist/lang/summernote-zh-CN.js",
        "./app/bower_components/angular-summernote/dist/angular-summernote.min.js"
    ])
        .pipe(ngAnnotate({single_quotes: true}))//gulp-ng-annotate是一个处理angularjs依赖注入的插件，依赖注入的项就不用再写两遍
        .pipe(uglify())
        .pipe(concat('bowerJs.js'))
        .pipe(gulp.dest('./dist/bowerJs'));
});
//js文件夹
gulp.task("js",function(){
    gulp.src("./app/js/*.js")
        .pipe(ngAnnotate({single_quotes: true}))//gulp-ng-annotate是一个处理angularjs依赖注入的插件，依赖注入的项就不用再写两遍
        .pipe(uglify())
        .pipe(concat('js.js'))
        .pipe(gulp.dest('./dist/js'));
})
//modules文件夹
gulp.task("modules",function(){
    gulp.src([
        "./app/modules/alerts/app.alerts.js",
        "./app/modules/alerts/config/alerts.config.js",
        "./app/modules/alerts/config/alerts.routes.js",
        "./app/modules/alerts/controllers/alerts.ctrl.js",
        "./app/modules/alerts/services/alerts.service.js",
        "./app/modules/collectors/app.collectors.js",
        "./app/modules/collectors/config/collectors.config.js",
        "./app/modules/collectors/config/collectors.routes.js",
        "./app/modules/collectors/controllers/collectors.ctrl.js",
        "./app/modules/collectors/services/collectors.service.js",
        "./app/modules/tickets/app.tickets.js",
        "./app/modules/tickets/config/tickets.config.js",
        "./app/modules/tickets/config/tickets.routes.js",
        "./app/modules/tickets/services/tickets.service.js",
        "./app/modules/tickets/controllers/tickets.ctrl.js",
        "./app/modules/eco/app.eco.js",
        "./app/modules/eco/config/eco.config.js",
        "./app/modules/eco/config/eco.routes.js",
        "./app/modules/eco/controllers/eco.ctrl.js",
        "./app/modules/eco/services/eco.service.js",
        "./app/modules/configs/app.configs.js",
        "./app/modules/configs/config/configs.config.js",
        "./app/modules/configs/config/configs.routes.js",
        "./app/modules/configs/controllers/configs.ctrl.js",
        "./app/modules/messages/app.messages.js",
        "./app/modules/messages/config/messages.config.js",
        "./app/modules/messages/config/messages.routes.js",
        "./app/modules/messages/controllers/messages.ctrl.js",
        "./app/modules/messages/services/messages.service.js",
        "./app/modules/core/app.core.js",
        "./app/modules/core/config/core.config.js",
        "./app/modules/core/config/core.constants.js",
        "./app/modules/core/config/core.routes.js",
        "./app/modules/core/controllers/home.ctrl.js",
        "./app/modules/core/controllers/layout.ctrl.js",
        "./app/modules/core/controllers/main.ctrl.js",
        "./app/modules/core/controllers/router.ctrl.js",
        "./app/modules/core/directives/admin-box.js",
        "./app/modules/core/directives/admin-form.js",
        "./app/modules/core/directives/admin-header.js",
        "./app/modules/core/directives/date.js",
        "./app/modules/core/directives/home.js",
        "./app/modules/core/directives/navbar.js",
        "./app/modules/core/directives/small-box.directive.js",
        "./app/modules/core/directives/thumb.js",
        "./app/modules/core/helpers/FormHelper.js",
        "./app/modules/core/services/core.service.js",
        "./app/modules/logs/app.logs.js",
        "./app/modules/logs/config/logs.config.js",
        "./app/modules/logs/config/logs.routes.js",
        "./app/modules/logs/controllers/logs.ctrl.js",
        "./app/modules/logs/services/logs.service.js",
        "./app/modules/projects/app.projects.js",
        "./app/modules/projects/config/projects.config.js",
        "./app/modules/projects/config/projects.routes.js",
        "./app/modules/projects/controllers/projects.ctrl.js",
        "./app/modules/projects/services/projects.service.js",
        "./app/modules/units/app.units.js",
        "./app/modules/units/config/units.config.js",
        "./app/modules/units/config/units.routes.js",
        "./app/modules/units/controllers/units.ctrl.js",
        "./app/modules/units/services/units.service.js",
        "./app/modules/users/app.users.js",
        "./app/modules/users/config/users.auth.js",
        "./app/modules/users/config/users.config.js",
        "./app/modules/users/config/users.routes.js",
        "./app/modules/users/controllers/login.ctrl.js",
        "./app/modules/users/controllers/profile.ctrl.js",
        "./app/modules/users/controllers/register.ctrl.js",
        "./app/modules/users/controllers/users.ctrl.js",
        "./app/modules/users/directives/login.js",
        "./app/modules/users/directives/register.js",
        "./app/modules/users/services/appauth.service.js",
        "./app/modules/users/directives/reset.js",
        "./app/modules/users/controllers/reset.ctrl.js",
        "./app/modules/modelrole/app.modelrole.js",
        "./app/modules/modelrole/config/modelrole.config.js",
        "./app/modules/modelrole/config/modelrole.routes.js",
        "./app/modules/modelrole/controllers/modelrole.ctrl.js",
        "./app/modules/modelrole/services/modelrole.service.js"
    ])
        .pipe(ngAnnotate({single_quotes: true}))//gulp-ng-annotate是一个处理angularjs依赖注入的插件，依赖注入的项就不用再写两遍
        .pipe(uglify())
        .pipe(concat('modules.js'))
        .pipe(gulp.dest('./dist/modules'));
})






