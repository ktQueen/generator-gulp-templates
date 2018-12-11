'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');// 让console.log带颜色输出
const yosay = require('yosay');
const mkdirp = require("mkdirp"); // 创建目录
const path = require('path');

module.exports=class extends Generator {
    /*初始化函数*/
    initializing() {
        this.props = {};
    }
    /*接收用户输入阶段*/
    prompting() {
        // 询问用户,接受用户输入
        this.log(yosay(
            'Welcome to the prime '+ chalk.red('templates-gulp') +' generator!'
        ));
        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Please input project name:',
                default: this.appname
            },
            {
                type: 'input',
                name: 'description',
                message: 'Please input project description:',
                default: ''
            },
            {
                type: 'input',
                name: 'author',
                message: '"Author\'s Name"',
                default: this.user.git.name()
            },
            {
                type: 'input',
                name: 'email',
                message: '"Author\'s Email"',
                default: this.user.git.email()
            },
            {
                type: 'input',
                name: 'repository',
                message: 'Project homepage url',
                default: ''
            },
            {
                type: 'input',
                name: 'license',
                message: 'License',
                default: 'ISC'
            }
        ];
        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }
    /*configuring - 保存配置信息和文件*/
    /*执行自定义函数*/
    default() {
        // 创建项目目录
        if (path.basename(this.destinationPath()) !== this.props.name) {
            this.log(`\nYour generator must be inside a folder named
        ${this.props.name}\n
        I will automatically create this folder.\n`);

            mkdirp(this.props.name);
            this.destinationRoot(this.destinationPath(this.props.name));
        }
    }
    /*生成项目目录结构阶段*/
    writing() {
        this.log('\nWriting...\n');
        // 拷贝文件，搭建脚手架
        // 将templates目录的代码拷贝到目标目录
        // templates目录默认路径是generators/app/templates
        this.fs.copy(
            this.templatePath('src/'),//this.templatePath - 返回模板文件路径，即上述 generator/app/templates 中的文件路径
            this.destinationPath('src/')//this.destinationPath - 返回目标文件路径，即执行 yo 生成模板文件的路径
        );
        this.fs.copy(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js')
        );
        this.fs.copy(
            this.templatePath('config.js'),
            this.destinationPath('config.js')
        );
        this._writingPackageJSON();
        this._writingREADME();
        this._writingGitignore();
    }
    // 以下划线_开头的是私有方法
    _writingPackageJSON() {
        // this.fs.copyTpl(from, to, context)
        this.fs.copyTpl(
            this.templatePath("_package.json"),
            this.destinationPath("package.json"),
            {
                name: this.props.name,
                description: this.props.description,
                author: this.props.author,
                email: this.props.email,
                repository: this.props.repository,
                license: this.props.license
            }
        );
    }
    _writingREADME() {
        this.fs.copyTpl(
            this.templatePath('README'),
            this.destinationPath('README'),
            {
                name: this.props.name,
                description: this.props.description,
                author: this.props.author,
                year: new Date().getFullYear()
            }
        );
    }
    _writingGitignore() {
        this.fs.copyTpl(
            this.templatePath('.gitignore'),
            this.destinationPath('.gitignore')
        );
    }
    /*conflicts - 统一处理冲突，如要生成的文件已经存在是否覆盖等处理*/
    /*安装依赖阶段*/
    install() {
        // 安装依赖
        this.log('\nInstall deps...\n');
        this.installDependencies({
            npm: true,
            bower: false,
            yarn: false,
            callback: function () {
                this.log('Everything is ready!');
            } });
    }
    /*生成器结束阶段*/
    end() {
        // 搭建完执行的操作
        this.log(yosay(
            'Your front templates has been created successfully!'
        ));
    }
};
