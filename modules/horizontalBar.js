define([
  'jquery',
  'echarts',
  'modules/chartDataFormate'
], function($, echarts, chartDataFormate) {
  'use strict';
  // 横向柱状图
  var horizontalBar = function (obj) {
    var _self = this;
    var data = this.initData(obj)
    var fn = (function (obj) {
      return function () {

        var bars_dates = chartDataFormate.FormateGroupData(data, 'bar', obj.stack);
        var legendData = bars_dates.category;
        var yAxis = [{
          type: 'category', //X轴均为category，Y轴均为value
          data: bars_dates.xAxis,
          //boundaryGap: true //数值轴两端的空白策略
        }];
        var series = bars_dates.series
        _self.chartCommonOption.legend.data.push.apply(_self.chartCommonOption.legend.data, legendData)
        $.extend(true, _self.chartCommonOption.yAxis, yAxis)
        _self.chartCommonOption.series.push.apply(_self.chartCommonOption.series, series)
        _self.renderChart(_self.chartCommonOption)
        _self._next()
      }

    })(obj)
    this.tasks.push(fn);
    return this;
  }

  return {
    horizontalBar: horizontalBar
  }
});