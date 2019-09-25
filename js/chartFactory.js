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
    this.init(opts)

  }
  ChartFactory._defaultOpts = {
    id: '',
    asy: false,
    data: [],
    url: '',
    themeType: ''

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
    }
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
      }
      return {
        category: categories,
        data: datas
      };
    },

  }

  var chartOptionTemplates = {
    pie: function (name) {
      var pie_datas = chartDataFormate.FormateNOGroupData(this.opts.data);
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
          name: name || "",
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          data: pie_datas.data
        }]
      };
      var pieOptions =  $.extend({}, chartCommonOption, option);
      this.renderChart(pieOptions)
    },
    lines: function (name, stack) {
      this.chartDataFormate(_self.opts.data, title, stack)
      this.renderChart()
    },
    bars: function (name, stack) {
      this.chartDataFormate(_self.opts.data, title, stack)
      this.renderChart()
    },
    map: function () {
      this.renderMap()
    }

  }
  ChartFactory.prototype = {
    init: function (opts) {
      this.opts = $.extend(ChartFactory._defaultOpts, opts);
      this.setChartTheme(this.opts.themeType)
      this.setChartOptionTemplates();
    },
    initData: function () {
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
    },
    setChartTheme: function (themeType) {
      var themes = {
        macarons: '' // 配置主题的路径
      }
      if (!this.opts.id) {
        return
      }
      this.chart = echarts.init(document.getElementById(this.opts.id), themes[themeType]);
    },
    chartDataFormate: function (data) {

    },
    setChartOptionTemplates: function () {
      $.extend(ChartFactory.prototype, chartOptionTemplates)
    },
    renderChart: function (chartOptions) {
      this.chart.setOption(chartOptions)
      this.resize()
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