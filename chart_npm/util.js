var _unique = function (arr) {
  if (!arr) {
    return false;
  }
  var result = [],
    hash = {};
  var firstItem = arr[0]
  if (firstItem instanceof Object) {
    for (var i = 0; i < arr.length; i++) {
      if (!hash[arr[i].name]) {
        result.push(arr[i])
        hash[arr[i].name] = true
      }
    }
    return result;
  } else {
    for (var i = 0, elem;
      (elem = arr[i]) != null; i++) {
      if (!hash[elem]) {
        result.push(elem);
        hash[elem] = true;
      }
    }
    return result
  }
}
var _deepClone = function (obj) { // 深克隆
  if (typeof obj === 'function') { // 函数
    return new Function('return ' + obj.toString())()
  }
  if (typeof obj !== 'object') { // 基本类型
    return obj
  }
  // 对象，数组
  var value, target = {}
  if (Object.prototype.toString.call(obj) === '[object Array]') { // 数组
    target = []
  }
  for (var name in obj) {
    value = obj[name]
    if (value === obj) { // 避免死循环
      continue;
    }
    if (typeof obj[name] === 'function' || typeof obj[name] === 'object') { // 函数或者对象/数组则递归复制
      target[name] = util._deepClone(obj[name])
    } else {
      target[name] = obj[name]
    }
  }
  return target

}
'use strict';

var $ = {};
$.ajax = ajax;

function ajax(options) {

  // 解析参数
  options = options || {};
  if (!options.url) return;
  options.type = options.type || 'get';
  options.timeout = options.timeout || 0;

  // 1 创建ajax
  if (window.XMLHttpRequest) {

    // 高级浏览器和ie7以上
    var xhr = new XMLHttpRequest();
  } else {

    //ie6,7,8
    var xhr = new ActiveXObject("Microsoft.XMLHTTP"); 
  }

  // 2 连接
  var str = jsonToUrl(options.data);
  if (options.type === 'get') {
    xhr.open('get', `${options.url}?${str}`, true);

    // 3 发送
    xhr.send();
  } else {
    xhr.open('post', options.url, true);

    // 请求头
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

    // 3 发送
    xhr.send();
  }

  // 接收
  xhr.onreadystatechange = function() {

    // 完成
    if (xhr.readyState === 4) {

      // 清除定时器
      clearTimeout(timer);

      if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {

        // 成功
        options.success && options.success(xhr.responseText);
      } else {
        options.error && options.error( xhr.status );
      }
    }
  };

  
  // 超时
  if (options.timeout) {
    var timer = setTimeout(function(){ 
            alert("超时了");
            xhr.abort(); // 终止
        },options.timeout);
  }
}


// json转url
function jsonToUrl(json) {
  console.log(json)
  var arr = [];
  json.t = Math.random();
  for(var name in json) {
    arr.push(name + '=' + encodeURIComponent(json[name]));
  }
  return arr.join('&');
}
export default {
  _unique: _unique,
  _deepClone: _deepClone,
  _ajax: ajax
}