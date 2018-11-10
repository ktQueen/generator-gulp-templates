'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports=class extends Generator {
    prompting() {
        // 询问用户
        this.log(yosay(
            'Welcome to the prime '+ chalk.red('templates-gulp') +' generator!'
        ));
        const prompts = [{
            type:'input',
            name:'appName',
            message:'What is your project name ?',
            default:"templates-gulp"
        }];
        return this.prompt(prompts).then(props => {
            this.props= props;
        });
    }
    writing() {
        // 拷贝文件，搭建脚手架
        this.fs.copy(
            this.templatePath('templates-gulp/'),
            this.destinationPath('templates-gulp/')
        );
    }
    end() {
        // 搭建完执行的操作
    }
};
