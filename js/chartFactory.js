(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'jquery',
      'echarts',
      'modules/util',
      'modules/chartDataFormate',
      'modules/chartCommonOption',
      'modules/pie',
      'modules/scatter',
      'modules/line',
      'modules/bars',
      'modules/horizontalBar',
      'modules/radar',
      'modules/riskMap'
    ], factory);
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports = factory;
  } else {
    // Browser globals
    root.JSLite = root.JSLite || factory(jQuery);
  }
})(this, function (
  $,
  echarts,
  util,
  chartDataFormate,
  chartCommonOption,
  pieModule,
  scatter,
  line,
  bars,
  horizontalBar,
  radar,
  riskMap
) {

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



  // 各种类型图表胚子
  var chartOptionTemplates = {}
  $.extend(
    chartOptionTemplates,
    pieModule,
    scatter,
    line,
    bars,
    horizontalBar,
    radar,
    riskMap
  )
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
      console.log(this.chartCommonOption)
    },
    // 继承线图，柱图类型的x,y坐标
    _extendxyAxis: function () {
      if (this.opts.yAxis || this.opts.xAxis) {
        $.extend(true, this.chartCommonOption.yAxis, this.opts.yAxis || [])
        $.extend(true, this.chartCommonOption.xAxis, this.opts.xAxis || [])
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
    chartDataFormate: function (data) {},
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
    resize: function () {
      var _self = this;
      $(window).on('resize', function () {
        _self.chart.resize()
      })
    }
  }
  return ChartFactory
})