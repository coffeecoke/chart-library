// define([
//   'jquery',
//   'echarts',
//   'modules/chartDataFormate'
// ], function($, echarts, chartDataFormate) {
//   'use strict';
//   // 折线图
//   var lineArea = function (obj) {
//     var _self = this;
//     var data = this.initData(obj)
//     var fn = (function (obj) {
//       return function () {
//         var stackline_datas = chartDataFormate.FormateGroupData(data, 'lineArea', obj.stack, obj.yAxisIndex);
//         var legendData = stackline_datas.category;
//         var xAxis = [{
//           type: 'category', //X轴均为category，Y轴均为value
//           data: stackline_datas.xAxis,
//           boundaryGap: true //数值轴两端的空白策略
//         }];
//         var series = stackline_datas.series
//         _self.chartCommonOption.legend.data.push.apply(_self.chartCommonOption.legend.data, legendData)
//         $.extend(true, _self.chartCommonOption.xAxis, xAxis)
//         _self.chartCommonOption.series.push.apply(_self.chartCommonOption.series, series)
//         _self.renderChart(_self.chartCommonOption)
//         _self._next()
//       }

//     })(obj)
//     this.tasks.push(fn);
//     return this;
//   }
//   return {
//     lineArea: lineArea
//   }
// });