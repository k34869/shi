const fs = require('fs');
const { argv } = require('process');

let res = fs.readFileSync(argv[2], 'utf8');
res = res.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/k34869\/shi/g, '');
fs.writeFileSync(argv[2], res, 'utf8');