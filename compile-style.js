const fs = require('fs');
const scss = fs.readFileSync('./src/app/style-module/config.scss', {'encoding': 'utf-8'});
const less = fs.readFileSync('./src/theme-temp.less', {'encoding': 'utf-8'});
const scssArr = scss.split('\r\n');
const lessArr = less.split('\r\n');
console.log(scssArr);
const scssMap = new Map();
scssArr.forEach(item => {
  const itemArr = item.split(':');
  if (itemArr.length === 2) {
    scssMap.set(itemArr[0], itemArr[1].substring(0, itemArr[1].length - 1).trim());
  }
});

lessArr.forEach((item, index) => {
  const itemArr = item.split(':');
  if (itemArr.length === 2) {
    const searchValue = itemArr[1].substring(0, itemArr[1].length - 1).trim();
    if (scssMap.has(searchValue)) {
      lessArr[index] = item.replace(searchValue, scssMap.get(searchValue));
    }
  }
});
const newLess = lessArr.join('\r\n');
fs.writeFile('./src/theme.less', newLess, {'encoding': 'utf-8'}, err => {
  if (err) {
    throw err;
  }
  console.log('less 文件编译成功！');
});
