import _ from 'lodash'
import chartDataFormate from './chartDataFormate'
'use strict';
// 雷达图基本配置
var radarCommonOption = {
  legend: {
    data: []
  },
  grid:{
    
  },
  radar: {
    shape: 'circle',
    radius: 80,
    name: {
      fontSize: 12,
      formatter: function (value, indicator) {
        return indicator.name + '  {valueStyle|' + indicator.max + '}'
      },
      rich: {
        valueStyle: {
          //color: '#0646ba',
          fontSize: 20,
          align: 'center'
        },
      },
      // textStyle: {
      //   color: '#fff'
      // }
    },
    indicator: [],
    splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
      show: true,
      areaStyle: { // 分隔区域的样式设置。
        color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
      }
    },
    axisLine: { //指向外圈文本的分隔线样式
      lineStyle: {
        type:"dashed",
        color: '#cccccc'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#cccccc', // 分隔线颜色
        width: 2, // 分隔线线宽
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
        
      },
      
    },
  },
  areaStyle: {
    
  }
}, {
  itemStyle: {
    normal: {
      lineStyle: {
        
      },
    },
  },
  areaStyle: {
  }
}]
// 雷达图
var radar = function (obj) {
  var _self = this;
  console.log(_self)
  var data = this.initData(obj);
  var fn = (function (obj) {
    return function () {
      var radars_dates = chartDataFormate.FormateGroupData(data, 'radar', obj.stack);
      var dataArr = radars_dates.series;
      var legendData = radars_dates.category;
      var indicator = radars_dates.indicator;
      _.forEach(dataArr, function (item, index) {
        _.assign(item, radarStyles[index])
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
      _.assign(radarCommonOption, radarOptions)
      _self.renderChart(radarCommonOption)
      _self._next()
    }
  })(obj)
  this.tasks.push(fn);
  return this;
}

export default {
  radar: radar
}