define([
  'jquery',
  'echarts',
], function($, echarts) {
  'use strict';
  // 柱状图
  // 配置图表主题
  var setChartTheme=function (themeType,opts) {
    var _this = this
    var themes = {
      wonderland: '../json/wonderland.json', // 配置主题的路径,
      customed11:'../json/customed11.json',
      essos: '../json/essos.json',
      customed: '../json/customed.json'
    }
    $.ajax({
      url: themes[themeType],
      async: false,
      success: function (data) {
        var obj = data;
        if (themeType) {
          echarts.registerTheme(themeType, obj);
          _this.colors=data.color
        }
      }
      
    })

    if (!opts.id) {
      return
    }
    this.chart = echarts.init(document.getElementById(opts.id), themeType);
  }
  return setChartTheme
});