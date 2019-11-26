define([
  'jquery',
  'echarts',
], function($, echarts) {
  'use strict';
  // 柱状图
  // 配置图表主题
  var setChartTheme=function (themeType,opts) {
    var themes = {
      wonderland: '../json/wonderland.json', // 配置主题的路径,
      essos: '../json/essos.json',
      customed: '../json/customed.json'
    }
    $.ajax({
      url: themes[themeType],
      async: false,
      success: function (data) {
        var obj = data;
        if (themeType) {
          echarts.registerTheme(themeType, obj)
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