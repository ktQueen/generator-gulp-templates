var inquirer = require('inquirer')
inquirer.prompt([ {
    type: 'confirm',
    name: 'test',
    message: 'Are you handsome?',
    default: true
}]).then((answers) => { console.log('结果为:'); console.log(answers)})


// var path = require('path')
// var copy = require('copy')
// module.exports=require('./lib')
// module.exports = function init(path) {
//     var _PATH = path('dirName',path)
//     copy('./src',_PATH)
//
// }

// var fs = require("fs")
//
// var mkDir = ['css', 'fonts', 'img', 'module']
// /* 创建目录 */
// for (var i = 0; i < mkDir.length; i++) {
//     fs.mkdir(mkDir[i], function (err) {
//         if (err) {
//             return console.error(err);
//         }
//     })
// }
//
// /* 读取index.html文件创建indexx.html文件 */
// fs.readFile('index.html', 'utf8', function (err, data) {
//     if (err) {
//         return console.error(err);
//     }
//     fs.appendFile('indexx.html', data, 'utf8', function (err) {
//         if (err) {
//             return console.error(err);
//         }
//     });
// });