(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'echarts'], factory);
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports = factory;
  } else {
    // Browser globals
    root.JSLite = root.JSLite || factory(jQuery);
  }
})(this, function ($, echarts) {
  function ChartFactory(opts) {
    this.tasks = []
    this.init(opts)

  }
  ChartFactory._defaultOpts = {
    id: '' || [],
    asy: false,
    data: [],
    url: '',
    themeType: ''

  }
  var util = {
    _unique: function (arr) {
      if (!arr) {
        return false;
      }
      var result = [],
        hash = {};
        firstItem = arr[0] 
      if(firstItem instanceof Object) {
        for(var i=0;i<arr.length;i++) {
          if(!hash[arr[i].name]) {
            result.push(arr[i])
            hash[arr[i].name] = true
          }
        }
        return result;
      }else {
        for (var i = 0, elem;
          (elem = arr[i]) != null; i++) {
          if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
          } 
        }
        return result
      }
      
      
    },
    _deepClone: function (obj) { // 深克隆
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
  }
  // 折线图，柱状图，散点图带坐标柱的基本配置
  var chartCommonOption = { //通用的图表基本配置
    tooltip: {
      trigger: 'axis' //tooltip触发方式:axis以X轴线触发,item以每一个数据项触发
    },
    toolbox: {
      show: false, //是否显示工具栏
      feature: {
        mark: true,
        dataView: {
          readOnly: false
        }, //数据预览
        restore: true, //复原
        saveAsImage: true //是否保存图片
      }
    },
    legend: {
      data: []
    },
    xAxis: [],
    yAxis: [],
    series: []

  }
  // 饼图基本配置
  var pieCommonOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}/%)',
      show: true
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: []
    },
    series: [{
      name: "",
      type: 'pie',
      radius: '65%',
      center: ['50%', '50%'],
    }]
  }
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
            console.log(value)
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

  // 图表数据格式化
  var chartDataFormate = {
    FormateNOGroupData: function (data) { //data的格式如上的Result1，这种格式的数据，多用于饼图、单一的柱形图的数据源
      var categories = [];
      var datas = [];
      for (var i = 0; i < data.length; i++) {
        categories.push(data[i].name || "");
        datas.push({
          name: data[i].name,
          value: data[i].value || 0
        });
      };
      return {
        category: categories,
        data: datas
      };
    },
    FormateGroupData: function (data, type, is_stack, yAxisIndex) { //data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
      var chart_type = 'line';
      if (type)
        chart_type = type || 'line';
      var xAxis = []
      var group = [];
      var series = [];
      var indicator = [];
      for (var i = 0; i < data.length; i++) {
        xAxis.push(data[i].name)
        group.push(data[i].group)
      }
      xAxis = util._unique(xAxis)
      group = util._unique(group)
      for (var i = 0; i < group.length; i++) {
        var temp = [];
        for (var j = 0; j < data.length; j++) {
          if (group[i] == data[j].group) {
            if (type == "map") {
              temp.push({
                name: data[j].name,
                value: data[i].value
              });
            } else if(type == "radar") {
              indicator.push({
                name:data[j].name,
                max:data[j].max
              })
              temp.push(data[j].value);
            }else {
              temp.push(data[j].value);
            }
          }
        }
        switch (type) {
          case 'bar':
            var series_temp = {
              name: group[i],
              data: temp,
              type: chart_type,
            };
            if (is_stack)
              series_temp = $.extend({}, {
                stack: 'stack'
              }, series_temp);
            break;
          case 'line':
            var series_temp = {
              name: group[i],
              data: temp,
              type: chart_type,
            };
            if (is_stack)
              series_temp = $.extend({}, {
                stack: 'stack'
              }, series_temp);
            break;
          case 'radar':
            var series_temp = {
              name: group[i],
              value: temp
              // type: chart_type,
            };
          default:
            // var series_temp = {
            //   // name: group[i],
            //   // data: temp,
            //   // type: chart_type,
            //   // yAxisIndex:yAxisIndex
            // };
        }
        if (yAxisIndex) {
          series_temp.yAxisIndex = yAxisIndex
        }
        series.push(series_temp);
      }
      return {
        category: group,
        indicator: util._unique(indicator),
        xAxis: xAxis,
        series: series
      };
    }
  }
  // 各种类型图表胚子
  var chartOptionTemplates = {
    // 饼图
    pie: function (obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
        return function () {
          var pie_datas = chartDataFormate.FormateNOGroupData(data);
          var option = {
            legend: {
              data: pie_datas.category
            },
            series: [{
              name: obj.name || "",
              data: pie_datas.data
            }]
          };
          var pieOptions = $.extend(true,pieCommonOption, option);
          _self.renderChart(pieOptions)
          _self._next()
        }
      })(obj)
      this.tasks.push(fn);
      return this;
    },
    // 折线图
    line: function (obj) {
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
          var series = stackline_datas.series
          _self.chartCommonOption.legend.data.push.apply(_self.chartCommonOption.legend.data, legendData)
          $.extend(true, _self.chartCommonOption.xAxis, xAxis)
          _self.chartCommonOption.series.push.apply(_self.chartCommonOption.series, series)
          _self.renderChart(_self.chartCommonOption)
          _self._next()
        }

      })(obj)
      this.tasks.push(fn);
      return this;
    },
    // 柱状图
    bars: function (obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
        return function () {
          var bars_dates = chartDataFormate.FormateGroupData(data, 'bar', obj.stack, obj.yAxisIndex);
          var legendData = bars_dates.category;
          var xAxis = [{
            type: 'category', //X轴均为category，Y轴均为value
            data: bars_dates.xAxis,
            boundaryGap: true //数值轴两端的空白策略
          }];
          var series = bars_dates.series
          _self.chartCommonOption.legend.data.push.apply(_self.chartCommonOption.legend.data, legendData)
          $.extend(true, _self.chartCommonOption.xAxis, xAxis)
          _self.chartCommonOption.series.push.apply(_self.chartCommonOption.series, series)
          _self.renderChart(_self.chartCommonOption)
          _self._next()
        }
      })(obj)
      this.tasks.push(fn);
      return this;
    },
    // 横向柱状图
    horizontalBar: function (obj) {
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
    },
    // 雷达图
    radar: function (obj) {
      var _self = this;
      var data = this.initData(obj);
      var fn = (function (obj) {
        return function () {
          var radars_dates = chartDataFormate.FormateGroupData(data, 'radar', obj.stack);
          var dataArr = radars_dates.series;
          var legendData = radars_dates.category;
          var indicator = radars_dates.indicator
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
          $.each(dataArr,function(index,item){
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
          $.extend(true,radarCommonOption, radarOptions)
          _self.renderChart(radarCommonOption)
          _self._next()
        }
      })(obj)
      this.tasks.push(fn);
      return this;
    },
    map: function () {
      this.renderMap()
    }

  }
  ChartFactory.prototype = {
    _next: function () {
      var fn = this.tasks.shift()
      fn && fn()
    },
    init: function (opts) {
      var _self = this;
      _self.setChartOptionTemplates();
      var fn = (function (opts) {
        return function () {
          _self.opts = $.extend({}, ChartFactory._defaultOpts, opts);
          _self.setChartTheme(_self.opts.themeType);
          _self._setChartOption()
          _self._extendxyAxis()
          _self._next()
        }
      })(opts)
      this.tasks.unshift(fn)
      setTimeout(function () {
        _self._next();
      }, 0)

    },
    // 克隆CommOption，以便给多个实例使用
    _setChartOption: function () {
      this.chartCommonOption = $.extend(true, {}, chartCommonOption) //clone
    },
    // 继承线图，柱图类型的x,y坐标
    _extendxyAxis: function () {
      if (this.opts.yAxis) {
        $.extend(true, this.chartCommonOption.yAxis, this.opts.yAxis)
      } else if (this.opts.xAxis) {
        $.extend(true, this.chartCommonOption.xAxis, this.opts.xAxis)
      }
    },
    //初始化数据
    initData: function (obj) {
      var data = [];
      if (obj.asy) {
        $.ajax({
          url: obj.url,
          type: 'post',
          async: false,
          success: function (result) {
            data = result;
          }
        })
      } else {
        data = obj.data
      }

      return data
    },
    // 配置图表主题
    setChartTheme: function (themeType) {
      var themes = {
        wonderland: '../json/wonderland.json', // 配置主题的路径,
        essos: '../json/essos.json'
      }
      $.ajax({
        url: themes[themeType],
        async: false,
        success: function (data) {
          obj = data;
          if (themeType) {
            echarts.registerTheme(themeType, obj)
          }
        }
      })

      if (!this.opts.id) {
        return
      }
      this.chart = echarts.init(document.getElementById(this.opts.id), themeType);
    },
    chartDataFormate: function (data) {

    },
    // ChartFactory原型扩展api
    setChartOptionTemplates: function () {
      $.extend(ChartFactory.prototype, chartOptionTemplates)
    },
    renderChart: function (chartOptions) {
      if (this.tasks && this.tasks.length === 0) {
        this.chart.setOption(chartOptions)
        this.resize()
      }
    },
    renderMap: function () {

    },
    resize: function () {
      var _self = this;
      $(window).on('resize', function () {
        _self.chart.resize()
      })
    }
  }
  return ChartFactory
})