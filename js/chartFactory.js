(function (root, factory) {
  
  if (typeof define === 'function' && define.amd) {
      // AMD
      // define([], factory);
      console.log(222)
      define(['jquery'],factory);
  } else if (typeof exports === 'object') {
      // Node.js
      module.exports = factory;
  } else {
      // Browser globals
      root.JSLite = root.JSLite || factory(jQuery);
  }
})(this, function ($) {
  function ChartFactory(opts) {
    this.init(opts)
  }
  ChartFactory._defaultOpts = {
    asy: false,
    data: [],
    url: '',
    themeType:'macarons'

  }
  ChartFactory.prototype.init = function (opts) {

    this.opts = $.extend(ChartFactory._defaultOpts, opts);
    this.setChartTheme (this.opts.themeType)
    this.setChartOptionTemplates();
  }
  ChartFactory.prototype.initData = function () {
    var _self = this;
    if (this.opts.asy) {
      $.ajax({
        url: this.opts.url,
        type: 'post',
        success: function (result) {
          _self.opts.data = result;

        }
      })

    } else {


    }

  }


  ChartFactory.prototype.setChartTheme = function (themeType) {
    var themes = {
      macarons:''// 配置主题的路径
    }
    this.chart = echarts.init(document.getElementById('main'),themes[themeType]);
  }
  ChartFactory.prototype.chartDataFormate = function (data) {


  }
  ChartFactory.prototype.setChartOptionTemplates = function () {
    var _self = this;
    var chartOptionTemplates = {
      CommonOption: { //通用的图表基本配置
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
        }
      },
      pie: function (title) {
        _self.chartDataFormate(_self.opts.data, title)
        _self.renderChart()
      },
      lines: function (title, stack) {
        _selft.chartDataFormate(_self.opts.data, title, stack)
        _self.renderChart()
      },
      bars: function (title, stack) {
        _selft.chartDataFormate(_self.opts.data, title, stack)
        _self.renderChart()
      },
      map:function () {
        _self.renderMap()
      }

    }
    return chartOptionTemplates
  }
  ChartFactory.prototype.renderChart = function () {

  }
  ChartFactory.prototype.renderMap = function () {

  }

  ChartFactory.prototype.resize = function () {
    var _self = this;
    $(window).on('resize',function () {
      _self.resize()
    })

  }


  return ChartFactory
})