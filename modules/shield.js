define([
  'jquery',
  'progressCanvas'
], function($,progressCanvas) {
  'use strict';
  // 折线图
  var shield = function (obj) {
    var _self = this;
    console.log(_self)  
    var fn = (function (obj) {
      return function () {
        var opts = {
          name:obj.name,
          width: 350,
          height: 300,
          bgColors: '#111',
          lineCap: 'round',
          showShadow: false,
          type: 'shield',
          wrapDom: $('#'+_self.id)[0],
          lineWidth: 8,
          lineColors: '#cccccc', //  array or string
          color:_self.shieldColor
        };
        console.log(opts);
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