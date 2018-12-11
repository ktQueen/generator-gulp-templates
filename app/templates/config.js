module.exports = {
    dev: {
        env:'dev',
        localServer : {
            port:5000,//端口号
            startPath:'src/views',//初始化开始的路径
            logFileChanges: false, //是否记录改变的文件名
            injectChanges: true //当css改变时，注入CSS改变，不整体刷新浏览器
        }
    },
    test: {
        env: 'test',
        stripDebug : true, //打包文件去掉console、alert、debugger
        // htmlMin : { //如果完全不用html压缩，请将此项置为false或者注释掉 ；html压缩所有配置项 https://github.com/kangax/html-minifier
        //   removeComments : true, //移除html注释
        //   collapseWhitespace : true, //去除空格
        //   conservativeCollapse :true, //去除空格时至少保留1个，
        //   preserveLineBreaks : true //合并空行时至少保留1个换行符
        // }
    },
    box: {
        env: 'box',
        stripDebug : true, //打包文件去掉console、alert、debugger
        // htmlMin : { //如果完全不用html压缩，请将此项置为false或者注释掉 ；html压缩所有配置项 https://github.com/kangax/html-minifier
        //   removeComments : true, //移除html注释
        //   collapseWhitespace : true, //去除空格
        //   conservativeCollapse :true, //去除空格时至少保留1个，
        //   preserveLineBreaks : true //合并空行时至少保留1个换行符
        // }
    },
    online: {
        env: 'online',
        stripDebug : true, //打包文件去掉console、alert、debugger
        // htmlMin : { //如果完全不用html压缩，请将此项置为false或者注释掉 ；html压缩所有配置项 https://github.com/kangax/html-minifier
        //   removeComments : true, //移除html注释
        //   collapseWhitespace : true, //去除空格
        //   conservativeCollapse :true, //去除空格时至少保留1个，
        //   preserveLineBreaks : true //合并空行时至少保留1个换行符
        // }
    }
};