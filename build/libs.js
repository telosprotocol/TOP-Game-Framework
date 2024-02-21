const path = require('path');
const fs = require('fs');

/**
 *  --
 * @param {*} argName --${argName}
 */
function getProcessArg(argName) {
  let args = Array.prototype.slice.call(process.argv, 2);
  for (let i = 0; i < args.length; i++) {
    let argv = args[i];
    if (argv.substr(2, argName.length) === argName) {
      let strV = argv.substr(argName.length + 2);
      const idxEqual = strV.indexOf('=');
      if (idxEqual > -1) {
        return strV.substr(idxEqual + 1).trim();
      }
      return strV;
    }
  }
  return;
}

/**
 * convert VUE_CPL_
 * @param {*} originEnv
 */
function resolveCompileEnv(originEnv) {
  let env = originEnv || {};
  Object.keys(process.env).forEach((key) => {
    if (/^VUE_CPL_/.test(key)) {
      let rVal;
      const strVal = process.env[key];
      switch (strVal) {
        case 'true':
          rVal = true;
          break;
        case 'false':
          rVal = false;
          break;
        default:
          rVal = JSON.stringify(strVal);
      }
      env[`process.env.${key}`] = rVal;
    }
  });
  return env;
}
/**
 *
 * @param {*} formatStr
 * @param {*} dtNumber
 */
function dateTimeFmt(formatStr, dtNumber) {
  let dt = new Date(dtNumber);

  let Y = dt.getYear() + 1900;
  let YS = String(Y);

  let M = dt.getMonth() + 1;
  let MS = String(M);
  if (MS.length === 1) MS = `0${MS}`;

  let D = dt.getDate();
  let DS = String(D);
  if (DS.length === 1) DS = `0${DS}`;

  let H = dt.getHours();
  let HS = String(H);
  if (HS.length === 1) HS = `0${HS}`;

  let m = dt.getMinutes();
  let mS = String(m);
  if (mS.length === 1) mS = `0${mS}`;

  let s = dt.getSeconds();
  let sS = String(s);
  if (sS.length === 1) sS = `0${sS}`;

  return formatStr
    .replace(/[Yy]{1,}/, YS)
    .replace(/M{1,}/, MS)
    .replace(/[Dd]{1,}/, DS)
    .replace(/[Hh]{1,}/, HS)
    .replace(/m{1,}/, mS)
    .replace(/[Ss]{1,}/, sS);
}

module.exports = {
  getProcessArg,
  dateTimeFmt,
  resolveCompileEnv,
};
