define([
  'jquery',
  'echarts',
  'modules/chartDataFormate'
], function($, echarts, chartDataFormate) {
  'use strict';
  // 雷达图基本配置
  var radarCommonOption = {
    legend: {
      data: []
    },
    radar: {
      shape: 'circle',
      name: {
        fontSize: 12,
        color: '#666666',
        formatter: function (value, indicator) {
          return indicator.name + '  {valueStyle|' + indicator.max + '}'
        },
        rich: {
          valueStyle: {
            color: '#0646ba',
            fontSize: 20,
            align: 'center'
          },

        },
        textStyle: {
          color: '#666666'
        }
      },
      indicator: [],
      splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
        show: true,
        areaStyle: { // 分隔区域的样式设置。
          // color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
        }
      },
      axisLine: { //指向外圈文本的分隔线样式
        lineStyle: {
          color: '#153269'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#113865', // 分隔线颜色
          width: 1, // 分隔线线宽
        }
      }

    },
    series: [{
      type: 'radar',
      symbolSize: 8
    }]
  }
  var radarStyles = [{
    itemStyle: {
      normal: {
        lineStyle: {
          // color: '#4A99FF',
          // shadowColor: '#4A99FF',
          // shadowBlur: 10,
        },
        // shadowColor: '#4A99FF',
        // shadowBlur: 10,
      },
    },
    areaStyle: {
      // normal: { // 单项区域填充样式
      //   color: {
      //     type: 'linear',
      //     x: 0, //右
      //     y: 0, //下
      //     x2: 1, //左
      //     y2: 1, //上
      //     colorStops: [{
      //       offset: 0,
      //       color: '#4A99FF'
      //     }, {
      //       offset: 0.5,
      //       color: 'rgba(0,0,0,0)'
      //     }, {
      //       offset: 1,
      //       color: '#4A99FF'
      //     }],
      //     globalCoord: false
      //   },
      //   opacity: 1 // 区域透明度
      // }
    }
  }, {
    itemStyle: {
      normal: {
        lineStyle: {
          // color: 'red',
          // shadowColor: '#4BFFFC',
          // shadowBlur: 10,
        },
        // shadowColor: '#4BFFFC',
        // shadowBlur: 10,
      },
    },
    areaStyle: {
      // normal: { // 单项区域填充样式
      //   color: {
      //     type: 'linear',
      //     x: 0, //右
      //     y: 0, //下
      //     x2: 1, //左
      //     y2: 1, //上
      //     colorStops: [{
      //       offset: 0,
      //       color: '#4BFFFC'
      //     }, {
      //       offset: 0.5,
      //       color: 'rgba(0,0,0,0)'
      //     }, {
      //       offset: 1,
      //       color: '#4BFFFC'
      //     }],
      //     globalCoord: false
      //   },
      //   opacity: 1 // 区域透明度
      // }
    }
  }]
  // 雷达图
  var radar = function (obj) {
    var _self = this;
    var data = this.initData(obj);
    var fn = (function (obj) {
      return function () {
        var radars_dates = chartDataFormate.FormateGroupData(data, 'radar', obj.stack);
        var dataArr = radars_dates.series;
        var legendData = radars_dates.category;
        var indicator = radars_dates.indicator
        $.each(dataArr, function (index, item) {
          $.extend(true, item, radarStyles[index])
        })
        var radarOptions = {
          legend: {
            data: legendData,
          },
          radar: {
            indicator: indicator,
          },
          series: [{
            data: dataArr
          }]
        }
        $.extend(true, radarCommonOption, radarOptions)
        _self.renderChart(radarCommonOption)
        _self._next()
      }
    })(obj)
    this.tasks.push(fn);
    return this;
  }

  return {
    radar: radar
  }
});