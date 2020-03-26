define([
  'jquery',
  'progressCanvas'
], function($,progressCanvas) {
  'use strict';
  // 折线图
  var shield = function (obj) {
    var _self = this;
    var fn = (function (obj) {
      return function () {
        var opts = {
          name:obj.name,
          width: 350,
          height: 300,
          bgColors: '#111',
          lineCap: 'round',
          showShadow: true,
          shadowBlur: 8,
          shadowColor: '#101856',
          type: 'shield',
          wrapDom: $('#'+_self.id)[0],
          lineWidth: 8,
          lineColors: '#122147', //  array or string
          shadowBlur: 5
        };
        var shieldProgress = new ProgressUtil.default(opts);
        shieldProgress.render();
        shieldProgress.update(obj.value);
      }
    })(obj)
    this.tasks.push(fn);
    return this;
  }
 
  return {
    shield: shield,
  }
});