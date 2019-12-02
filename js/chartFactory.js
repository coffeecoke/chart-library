(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'jquery',
      'echarts',
      'modules/util',
      'modules/chartDataFormate',
      'modules/chartCommonOption',
      'modules/pies',
      'modules/scatter',
      'modules/line',
      'modules/bars',
      'modules/radar',
      'modules/riskMap',
      'modules/theme'
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
  pies,
  scatter,
  lines,
  bars,
  radar,
  riskMap,
  setChartTheme
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
    themeType: '',
  }



  // 各种类型图表胚子
  var chartOptionTemplates = {}
  $.extend(
    chartOptionTemplates,
    pies,
    scatter,
    lines,
    bars,
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
          setChartTheme.call(_self, _self.opts.themeType,_self.opts);
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