/**
 * 自定义的事件总线
 * 方法: 
 * on: 绑定一个事件
 * once: 绑定一个一次性事件
 * off: 移除一个事件
 * emit: 触发一个事件
 * use: 添加一个中间件
 * 
 * @author chengxg
 * @since 2018-12-29
 * @constructor
 */
export function EventBus() {
  this.eventArr = []; //事件列表
  this.useFunArr = []; //添加的中间件列表
}

export default new EventBus() //默认导出一个实例

/**
 * 创建一个事件
 * @param {String} name 
 * @param {Function} callback 
 */
EventBus.prototype.createEvent = function (name, callback) {
  return {
    name: name, //事件名
    isOnce: false, //是否只执行一次
    callback: callback //回调
  }
}

/**
 * 获取事件
 * @param {String} name 
 * @param {Function} fn 
 */
EventBus.prototype.getEvent = function (name, fn) {
  let matchFn = fn && typeof fn == 'function';
  return this.eventArr.filter((e) => {
    let b = e.name === name;
    if (matchFn) {
      b = b && e.fn === fn;
    }
    return b;
  })
}

/**
 * 移除一个事件
 * @param {String} name 
 * @param {Function} fn fn为空则全部移除
 */
EventBus.prototype.removeEvent = function (name, fn) {
  let matchFn = fn && typeof fn == 'function';
  this.eventArr = this.eventArr.filter((e) => {
    let b = e.name === name;
    if (matchFn) {
      b = b && e.fn === fn;
    }
    return !b;
  })
}

//同removeEvent
EventBus.prototype.off = function (name, fn) {
  this.removeEvent(name, fn);
}

/**
 * 添加中间件
 * @param {Function} fn
 */
EventBus.prototype.use = function (fn) {
  this.useFunArr.push(fn)
}

/**
 * 中间件过滤
 * @param {Object} packet 
 */
EventBus.prototype.useFilter = function (packet) {
  let useFunArr = this.useFunArr;
  let len = useFunArr.length;
  let index = 0;
  if (len) {
    useFunArr[0](packet, next);
    if (index === len - 1) {
      return true;
    } else {
      return false;
    }
  }
  return true;

  function next() {
    index++;
    if (index < len) {
      useFunArr[index](packet, next);
    }
  }
}

/**
 * 添加事件
 * @param {String} name
 * @param {Function} fn
 */
EventBus.prototype.on = function (name, fn, cover = false) {
  let ev = this.createEvent(name, fn);
  if (cover) {
    let eventArr = this.getEvent(name);
    if (eventArr.length > 0) {
      this.removeEvent(name);
    }
  }
  this.eventArr.push(ev);
  return ev;
}

/**
 * 添加事件, 执行完立即立即销毁
 * @param {String} event 
 * @param {Function} fn 
 */
EventBus.prototype.once = function (name, fn, cover = false) {
  let ev = this.on(name, fn, cover);
  ev.isOnce = true;
}

/**
 * 触发一个事件
 * @param {String} event
 * @param {Object} data
 */
EventBus.prototype.emit = function (name, data) {
  let eventArr = this.getEvent(name);
  let b = this.useFilter([name, data]);
  if (!b) {
    return;
  }
  let len = eventArr.length,
    ev;
  for (let i = 0; i < len; i++) {
    ev = eventArr[i];
    //执行监听的事件
    if (typeof ev.callback === 'function') {
      let b = ev.callback(data);
      if (ev.isOnce) {
        this.removeEvent(event);
      }
      if (typeof b != 'undefined' && b === false) {
        return;
      }
    }
  }
}
