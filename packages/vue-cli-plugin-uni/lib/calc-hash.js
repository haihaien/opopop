/*
 * @Author: Aleyn He
 * @Date: 2020-07-02 15:58:22
 * @LastEditors: Aleyn He
 * @LastEditTime: 2020-07-02 18:53:24
 * @Description: 
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * 计算文件md5值
 * @param {*} fullPath 文件全路径
 */
function algorithm(fullPath) {
  let fsHash = crypto.createHash('md5');
  let buffer = fs.readFileSync(fullPath);
  fsHash.update(buffer);
  return fsHash.digest('hex')
}

/**
 * 递归遍历目录计算文件md5值
 * @param {*} dir 目录
 * @param {*} result 输出结果，传入空对象
 * @param {*} algorithm 算法
 */
function readFileList(dir, result, algorithm) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    let fullPath = path.join(dir, item);
    let relativePath = '' + path.relative(root, fullPath);
    relativePath = relativePath.replace(/[\\]+/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), result, algorithm);
    } else {
      result[relativePath] = algorithm(fullPath);
    }
  });
}


module.exports = function (root) {
  // let platform = 'h5'
  // let root = path.resolve(__dirname, `dist/build/${platform}`);
  let result = {};
  readFileList(root, result, algorithm);
  // 写入文件version.manifest
  fs.writeFileSync(path.resolve(root, 'version.manifest'), JSON.stringify(result));
}
