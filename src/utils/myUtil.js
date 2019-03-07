/**
 * 自己封装的一些常用的工具
 * @author chengxg
 * @since 2018-1-11
 */

let myUtil = (function () {
  'use strict';

  let obj = new Object();
  obj.clone = clone;
  obj.extend = extend;
  obj.isObject = isObject;
  obj.isArray = isArray;
  obj.shuffle = shuffle;
  obj.shuffleMeisen = shuffleMeisen;
  obj.getHtmlTemplate = getHtmlTemplate;
  obj.formatDate = formatDate;
  obj.formatBackstageDate = formatBackstageDate;
  obj.floatAdd = floatAdd;
  obj.floatSub = floatSub;
  obj.floatMul = floatMul;
  obj.floatDiv = floatDiv;
  obj.serializeFormData = serializeFormData;
  obj.getQueryString = getQueryString;
  obj.resoveURLParams = resoveURLParams;
  obj.getObjFromArrByFiled = getObjFromArrByFiled;
  obj.getScrollEventTarget = getScrollEventTarget;
  obj.getScrollTop = getScrollTop;

  return obj;

  function isType(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
  }

  function isObject(val) {
    return isType(val) === 'Object';
  }

  function isArray(val) {
    return isType(val) === 'Array';
  }

  function isFunction(val) {
    return isType(val) === 'Function';
  }

  /**
   * 继承
   * @param {Object} dest
   * @param {Object} src
   * @return {Object}
   */
  function extend(dest, src) {
    if (isObject(dest) || isFunction(dest) && isObject(src)) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          if (isObject(src[key])) {
            dest[key] = extend(isObject(dest[key]) ? dest[key] : {}, src[key]);
          } else if (isArray(src[key])) {
            dest[key] = extend(isArray(dest[key]) ? dest[key] : [], src[key]);
          } else {
            dest[key] = src[key];
          }
        }
      }
    } else if (isArray(dest) && isArray(src)) {
      for (var i = 0, len = src.length; i < len; i++) {
        if (isObject(src[i])) {
          dest.push(extend({}, src[i]));
        } else if (isArray(src[i])) {
          dest.push(extend([], src[i]));
        } else {
          dest.push(src[i]);
        }
      }
    }
    return dest;
  }

  /**
   * 深度克隆
   * @param {Object} obj
   * @return {Object}
   */
  function clone(obj) {
    if (isObject(obj)) {
      return extend({}, obj);
    } else if (isArray(obj)) {
      return extend([], obj);
    } else {
      return obj;
    }
  }

  /**
   * 根据对象的字段值从数组中查询这个对象
   * @param {Array} arr
   * @param {String} filed
   * @param {Object} filedVal
   */
  function getObjFromArrByFiled(arr, filed, filedVal) {
    var len = arr.length,
      temp = null;
    for (var i = 0; i < len; i++) {
      temp = arr[i];
      if (temp[filed] === filedVal) {
        return temp;
      }
    }
    return null;
  }

  /**
   * 经典的洗牌算法
   * @param {Array} arr
   */
  function shuffle(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
      var idx = Math.floor(Math.random() * (len - i));
      var temp = arr[idx];
      arr[idx] = arr[len - i - 1];
      arr[len - i - 1] = temp;
    }
    return arr;
  }

  /**
   * 梅森旋转矢量算法产生随机数
   */
  let meisenRandom = (function meisen() {
    let isInit = 0;
    let index;
    let MT = new Array(624); //624 * 32 - 31 = 19937

    function srand(seed) {
      index = 0;
      isInit = 1;
      MT[0] = seed;
      //对数组的其它元素进行初始化
      for (let i = 1; i < 624; i++) {
        let t = 1812433253 * (MT[i - 1] ^ (MT[i - 1] >> 30)) + i;
        MT[i] = t & 0xffffffff; //取最后的32位赋给MT[i]
      }
    }

    function generate() {
      for (let i = 0; i < 624; i++) {
        // 2^31 = 0x80000000
        // 2^31-1 = 0x7fffffff
        let y = (MT[i] & 0x80000000) + (MT[(i + 1) % 624] & 0x7fffffff);
        MT[i] = MT[(i + 397) % 624] ^ (y >> 1);
        if (y & 1) {
          MT[i] ^= 2567483615;
        }
      }
    }

    function rand() {
      if (!isInit) {
        srand(new Date().getTime());
      }

      if (index == 0) {
        generate();
      }

      let y = MT[index];
      y = y ^ (y >> 11); //y右移11个bit
      y = y ^ ((y << 7) & 2636928640); //y左移7个bit与2636928640相与，再与y进行异或
      y = y ^ ((y << 15) & 4022730752); //y左移15个bit与4022730752相与，再与y进行异或
      y = y ^ (y >> 18); //y右移18个bit再与y进行异或
      index = (index + 1) % 624;
      return y;
    }
    return {
      srand: srand,
      rand: rand
    };
  })();

  /**
   * 梅森旋转矢量的洗牌算法
   * @param {Array} arr
   */
  function shuffleMeisen(arr) {
    meisenRandom.srand(Math.round(Math.random() * (new Date().getTime())));
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      let r = meisenRandom.rand();
      let idx = r % len;
      let temp = arr[idx];
      arr[idx] = arr[len - i - 1];
      arr[len - i - 1] = temp;
    }
    return arr;
  }

  /**
   * 得到js中注释的html模板
   * @param {Funcion} tmpl
   */
  function getHtmlTemplate(tmpl) {
    tmpl = tmpl + "";
    return tmpl.toString().match(/[^]*\/\*([^]*)\*\/\s*\}$/)[1];
  }

  /**
   * 日期格式化
   * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * @param {Date} date
   * @param {String} fmt
   */
  function formatDate(date, fmt) {
    if (!data) {
      return "";
    }
    var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  /**
   * 格式化后台的日期
   * 默认转换为日期类型, 如果设置 fmt 参数则转换为对应的日期字符串
   * @param {Object} dateObj (json字符串 或 ajax请求后的数据)
   * @param {String} fmt
   */
  function formatBackstageDate(dateObj, fmt) {
    if (!dateObj) {
      return "";
    }
    let fmtDate = null;

    //去掉日期字符串的中的 "T"
    if (typeof dateObj === 'string') {
      //苹果不支持 "2018-07-12"这种类型的格式化
      dateObj = dateObj.replace(/-/g, "/");
      fmtDate = new Date(dateObj.replace("T", " "));
    }

    //时间戳
    if (typeof dateObj === 'number') {
      fmtDate = new Date(dateObj);
    }

    if (dateObj instanceof Date) {
      fmtDate = dateObj;
    }

    //处理json字符串中的日期
    if (typeof dateObj === 'object' && !isNaN(dateObj.time)) {
      fmtDate = new Date(dateObj.time);
    }

    if (fmtDate != null && typeof fmt !== 'undefined') {
      fmtDate = formatDate(fmtDate, fmt);
    }

    return fmtDate;
  }

  //js精确加法    
  function floatAdd(arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
  }

  //js精确 减法    
  function floatSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度    
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }

  //js精确 乘法     
  function floatMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }

  //js精确 除法    
  function floatDiv(arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }

  /**
   * 序列化表单对象, 值是 undefined 或 null的字段会过滤掉
   * let serializeData = myUtil.serializeFormData("", {
      a: "a",
      b: 2,
      c: true,
      d: [{
        z: "z",
        x: 3
      }, {
        v: [1, 2, ["qwe", "sdf"]],
        n: 45
      }],
      e: {
        g: "g"
      }
    });
    console.log(serializeData);
   * @param {String} parentName
   * @param {Object} obj 要序列化的对象
   */
  function serializeFormData(parentName, obj) {
    var data = {};
    var i, len, filed, childData, childField;
    if (isArray(obj)) {
      for (i = 0, len = obj.length; i < len; i++) {
        if (isArray(obj[i]) || isObject(obj[i])) {
          childData = serializeFormData("", obj[i]);
          for (childField in childData) {
            if (childData[childField] === undefined || childData[childField] === null) {
              continue;
            }
            if (childField.charAt(0) === '[') {
              data[parentName + "[" + i + "]" + childField] = childData[childField];
            } else {
              data[parentName + "[" + i + "]." + childField] = childData[childField];
            }
          }
        } else {
          data[parentName + "[" + i + "]"] = obj[i];
        }
      }
    }
    if (isObject(obj)) {
      for (filed in obj) {
        if (obj[filed] === undefined || obj[filed] === null) {
          continue;
        }
        if (isArray(obj[filed]) || isObject(obj[filed])) {
          childData = serializeFormData(filed, obj[filed]);
          for (childField in childData) {
            if (childData[childField] === undefined || childData[childField] === null) {
              continue;
            }
            if (parentName) {
              data[parentName + "." + childField] = childData[childField];
            } else {
              data[childField] = childData[childField];
            }
          }
        } else {
          if (parentName) {
            data[parentName + "." + filed] = obj[filed];
          } else {
            data[filed] = obj[filed];
          }
        }
      }
    }
    return data;
  }

  /**
   * 从url获取参数
   * @param {String} name 参数名
   */
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }

  /**
   * 
   * 解析出所有的url参数
   * @param {String} url 
   * @returns {Object} params
   */
  function resoveURLParams(url) {
    let params = {};
    url = decodeURI(url);
    let matchs = url.match(/[a-zA-Z0-9]+=[^&\?\/\\#]*/g);
    if (matchs != null) {
      matchs.forEach(element => {
        let arr = element.split("=");
        params[arr[0]] = unescape(arr[1]);
      })
    }
    return params;
  }

  function getScrollEventTarget(element) {
    let currentNode = element;
    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.nodeType === 1) {
      const overflowY = window.getComputedStyle(currentNode).overflowY;
      if (overflowY === 'scroll' || overflowY === 'auto') {
        return currentNode;
      }
      currentNode = currentNode.parentNode;
    }
    return window;
  }

  function getScrollTop(element) {
    if (element === window) {
      return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
    } else {
      return element.scrollTop;
    }
  }

})();

export default myUtil
