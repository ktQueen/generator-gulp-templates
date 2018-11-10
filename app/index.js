var generators = require('yeoman-generator'),
    _ = require('yeoman-generator/node_modules/lodash'),
    glob = require('yeoman-generator/node_modules/glob'),
    chalk = require('yeoman-generator/node_modules/chalk'),
    log = console.log,
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    generatorName = 'gulp';  // 记住这个名字，下面会有用

// 导出模块，使得yo xxx能够运行
module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        // 检查脚手架是否已经存在
        var dirs = glob.sync('+(src)');
        //now _.contains has been abandoned by lodash,use _.includes
        if(_.includes(dirs, 'src')){
            // 如果已经存在脚手架，则退出
            log(chalk.bold.green('资源已经初始化，退出...'));
            setTimeout(function(){
                process.exit(1);
            }, 200);
        }
    },
    prompting: function(){
        var questions = [
            {
                name: 'projectAssets',
                type: 'list',
                message: '请选择模板:',
                choices: [
                    {
                        name: 'PC模板',
                        value: 'pc',
                        checked: true   // 默认选中
                    },{
                        name: 'Mobile模板',
                        value: 'mobile'
                    }
                ]
            },
            {
                type: 'input',
                name: 'projectName',
                message: '输入项目名称',
                default: this.appname
            },
            {
                type: 'input',
                name: 'projectAuthor',
                message: '项目开发者',
                store: true,   // 记住用户的选择
                default: 'huangxiaoyan'
            },{
                type: 'input',
                name: 'projectVersion',
                message: '项目版本号',
                default: '0.0.1'
            }
        ]
        return this.prompt(questions).then(
            function(answers){
                for(var item in answers){
                    // 把answers里的内容绑定到外层的this，便于后面的调用
                    answers.hasOwnProperty(item) && (this[item] = answers[item]);
                }
            }.bind(this));
    },
    writing: function(){
        /**
         * 可以在prompting阶段让用户输入
         * 也可以指定，完全根据个人习惯
         **/
        this.projectOutput = './dist';
        //拷贝文件
        this.directory(this.projectAssets,'src');
        this.copy('gulpfile.js', 'gulpfile.js');
        this.copy('package.json', 'package.json');
    },
    end: function(){
        /**
         * 删除一些多余的文件
         * 由于无法复制空文件到指定目录，因此，如果想要复制空目录的话
         * 只能在空文件夹下建一个过渡文件，构建完后将其删除
         **/
        del(['src/**/.gitignore','src/**/.npmignore']);
        var dirs = glob.sync('+(node_modules)');
        if(!_.includes(dirs, 'node_modules')){
            // 将你项目的node_modules和根目录下common-packages的node_modules进行软连接
            // 为什么要这样做，大家可以先想想
            this.spawnCommand('ln', ['-s', '/usr/local/lib/node_modules/common-packages/'+generatorName+'/node_modules', 'node_modules']);
        }
    }
});
