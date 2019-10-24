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
      if (!arr && !Sco.Type.isArray(arr)) {
        return false;
      }
      var result = [],
        hash = {};
      for (var i = 0, elem;
        (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
          result.push(elem);
          hash[elem] = true;
        }
      }
      return result;
    }
  }

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
  var chartPieOption = {

  }

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
    // 
    FormateGroupData: function (data, type, is_stack,yAxisIndex) { //data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
      var chart_type = 'line';
      if (type)
        chart_type = type || 'line';
      var xAxis = []
      var group = [];
      var series = [];
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
            if (type == "map")
              temp.push({
                name: data[j].name,
                value: data[i].value
              });
            else
              temp.push(data[j].value);
          }
        }
        switch (type) {
          case 'bar':
            var series_temp = {
              name: group[i],
              data: temp,
              type: chart_type,
              yAxisIndex:yAxisIndex
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
              yAxisIndex:yAxisIndex
            };
            if (is_stack)
              series_temp = $.extend({}, {
                stack: 'stack'
              }, series_temp);
            break;
          default:
            var series_temp = {
              name: group[i],
              data: temp,
              type: chart_type,
              yAxisIndex:yAxisIndex
            };
        }
        series.push(series_temp);
      }
      return {
        category: group,
        xAxis: xAxis,
        series: series
      };
    }
  }
  var chartOptionTemplates = {
    pie: function (obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
        return function () {
          var pie_datas = chartDataFormate.FormateNOGroupData(data);
          var option = {
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c} ({d}/%)',
              show: true
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: pie_datas.category
            },
            series: [{
              name: obj.name || "",
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              data: pie_datas.data
            }]
          };
          var pieOptions = $.extend(chartPieOption, option);
          _self.renderChart(pieOptions)
          _self._next()
        }
      })(obj)
      this.tasks.push(fn);
      return this;
    },
    line: function (obj) {
      var _self = this;
      var data = this.initData(obj)
      
      var fn = (function (obj) {
        return function () {
          var stackline_datas = chartDataFormate.FormateGroupData(data, 'line', obj.stack,obj.yAxisIndex);
          var legendData = stackline_datas.category;
          var xAxis = [{
            type: 'category', //X轴均为category，Y轴均为value
            data: stackline_datas.xAxis,
            boundaryGap: true //数值轴两端的空白策略
          }];
          var series = stackline_datas.series
          chartCommonOption.legend.data.push.apply(chartCommonOption.legend.data,legendData)
          $.extend(true, chartCommonOption.xAxis, xAxis)
          chartCommonOption.series.push.apply(chartCommonOption.series,series)
          // return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
          _self.renderChart(chartCommonOption)
          _self._next()
        }

      })(obj)
      this.tasks.push(fn);
      return this;
    },
    bars: function (obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
        return function () {
          var bars_dates = chartDataFormate.FormateGroupData(data, 'bar', obj.stack,obj.yAxisIndex);
          var legendData = bars_dates.category;
          var xAxis = [{
            type: 'category', //X轴均为category，Y轴均为value
            data: bars_dates.xAxis,
            boundaryGap: true //数值轴两端的空白策略
          }];
          var series = bars_dates.series
          chartCommonOption.legend.data.push.apply(chartCommonOption.legend.data,legendData)
          $.extend(true, chartCommonOption.xAxis, xAxis)
          chartCommonOption.series.push.apply(chartCommonOption.series,series)
          // return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
          _self.renderChart(chartCommonOption)
          _self._next()
        }

      })(obj)
      this.tasks.push(fn);
      return this;
    },
    horizontalBar:function(obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
        return function () {
          var bars_dates = chartDataFormate.FormateGroupData(data, 'bar', obj.stack,obj.yAxisIndex);
          var legendData = bars_dates.category;
          var xAxis = [{
            type: 'category', //X轴均为category，Y轴均为value
            data: bars_dates.xAxis,
            boundaryGap: true //数值轴两端的空白策略
          }];
          var series = bars_dates.series
          chartCommonOption.legend.data.push.apply(chartCommonOption.legend.data,legendData)
          $.extend(true, chartCommonOption.xAxis, xAxis)
          chartCommonOption.series.push.apply(chartCommonOption.series,series)
          // return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
          _self.renderChart(chartCommonOption)
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
          _self.opts = $.extend(ChartFactory._defaultOpts, opts);
          _self.setChartTheme(_self.opts.themeType);
          _self._extendyAxis()
          _self._next()
        }
      })(opts)
      this.tasks.unshift(fn)
      setTimeout(function () {
        _self._next();
      }, 0)

    },
    _extendyAxis: function () {
      $.extend(true, chartCommonOption.yAxis, this.opts.yAxis)
    },
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