import _ from 'lodash'
import echarts from 'echarts'
import chartDataFormate from './chartDataFormate'
'use strict';
// 折线图
var line = function (obj) {
  var _self = this;
  var data = this.initData(obj)
  var fn = (function (obj) {
    return function () {
      var stackline_datas = chartDataFormate.FormateGroupData(data, 'line', obj.stack, obj.yAxisIndex);
      var legendData = stackline_datas.category;
      var xAxis = [{
        type: 'category', //X轴均为category，Y轴均为value
        data: stackline_datas.xAxis,
        boundaryGap: true //数值轴两端的空白策略
      }];
      var yAxis = [{
        nameLocation:'end',
        nameTextStyle:{
          fontSize:12,  
          padding:[0 ,0 ,0 ,-50]
        },
      }];
      var legend={
        data: [],
        icon: 'circle',
        itemWidth:8,
        itemHeight:8,
      };
      var series = stackline_datas.series;
      _.forEach(series,function (item, index) {
        // var itemStyle={
        //     color: _self.colors[index],
        // }
        var symbol='circle';
        // item.itemStyle = itemStyle;
        item.symbol = symbol;
        item.yAxis = yAxis;
      })
      _self.chartCommonOption.legend.data.push.apply(_self.chartCommonOption.legend.data, legendData)
      _.assign(_self.chartCommonOption.xAxis, xAxis)
      _.assign(_self.chartCommonOption.legend, legend)
      _.assign(_self.chartCommonOption.yAxis, yAxis)
      _self.chartCommonOption.series.push.apply(_self.chartCommonOption.series, series)
      _self.renderChart(_self.chartCommonOption)
      _self._next()
    }
  })(obj)
  this.tasks.push(fn);
  return this;
}

var lineArea = function (obj) {
  var _self = this;
  var data = this.initData(obj)
  var fn = (function (obj) {
    return function () {
      var stackline_datas = chartDataFormate.FormateGroupData(data, 'line', obj.stack, obj.yAxisIndex);
      var legendData = stackline_datas.category;
      var xAxis = [{
        type: 'category', //X轴均为category，Y轴均为value
        data: stackline_datas.xAxis,
        boundaryGap: true //数值轴两端的空白策略
      }];
      var yAxis = [{
        nameLocation:'end',
        nameTextStyle:{
          fontSize:12,  
          padding:[0 ,0 ,0 ,-50]
        },
      }];
      var legend={
        data: [],
        icon: 'circle',
        itemWidth:8,
        itemHeight:8,
      };
      var series = stackline_datas.series;
      _.forEach(series,function (item, index) {
        var currObjAreaStyle = {
          normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: (_self.colors[index].split(')'))[0] + ',0.8)',
                  opacity:.3
              }, {
                  offset: 0.8,
                  color: (_self.colors[index].split(')'))[0] + ',0)',
                  opacity:0
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
          }
        }
        var itemStyle={
            color: _self.colors[index],
        }
        var symbol='circle';
        item.areaStyle = currObjAreaStyle;
        item.itemStyle = itemStyle;
        item.symbol = symbol;
        item.yAxis = yAxis;
      })
      _self.chartCommonOption.legend.data.push.apply(_self.chartCommonOption.legend.data, legendData)
      _.assign(true, _self.chartCommonOption.xAxis, xAxis)
      _.assign(true, _self.chartCommonOption.legend, legend)
      _.assign(true, _self.chartCommonOption.yAxis, yAxis)
      _self.chartCommonOption.series.push.apply(_self.chartCommonOption.series, series)
      _self.renderChart(_self.chartCommonOption)
      _self._next()
    }

  })(obj)
  this.tasks.push(fn);
  return this;
}
export default {
  line: line,
  lineArea:lineArea
}