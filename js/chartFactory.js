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
    id: '' || [],
    asy: false,
    data: [],
    url: '',
    themeType: ''

  }
  var tasks =[];

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
      };
      return {
        category: categories,
        data: datas  
      };
    },
  }
  var chartOptionTemplates = {
    pie: function (name) {
      var _self = this;
      var fn = (function (name){
        return function () {
          _self._next()
        }
      })(name)
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
    line: function (name, stack) {
      var line_datas = chartDataFormate.FormateNOGroupData(this.opts.data);
      var option = {
        xAxis: [{
          boundaryGap: true,
          axisLine: { //坐标轴轴线相关设置。数学上的x轴
            show:false,
            lineStyle: {
              color: 'ransparent'
            }
          },
          splitLine:{
            show:false
        },
          axisLabel: { //坐标轴刻度标签的相关设置
            show:true,
              textStyle: {
                  color: '#000'
              },
          },
          axisTick: {
              show: false,
          },
          data: line_datas.category
      }],
      yAxis: [{
        type: 'value',
        min: 0,
        // max: 140,
        splitNumber: 4,
        splitLine: {
            show: true,
            lineStyle: {
              color: '#DDD'
            }
        },
        axisLine: {
            show: true,
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#000',

            },
        },
        axisTick: {
            show: true,
        },
    }],
        series: [{
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          data: line_datas.data,
        }]
      };
      var lineOptions =  $.extend({}, chartCommonOption, option);
      this.renderChart(lineOptions)
    },
    bars: function (name, stack) {
      var bar_datas = chartDataFormate.FormateNOGroupData(this.opts.data);
      var option = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              data : bar_datas.category,
              axisTick: {
                  alignWithLabel: true
              }
          }
      ],
      yAxis: [{
        type: 'value',
        min: 0,
        // max: 140,
        splitNumber: 4,
        splitLine: {
            show: true,
            lineStyle: {
              color: '#DDD'
            }
        },
        axisLine: {
            show: true,
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#000',

            },
        },
        axisTick: {
            show: true,
        },
    }],
      series : [
          {
              name:'直接访问',
              type:'bar',
              barWidth: '60%',
              data:bar_datas.data,
          }
      ]
      };
      var barOptions =  $.extend({}, chartCommonOption, option);
      // this.chartDataFormate(_self.opts.data, title, stack)
      this.renderChart(barOptions)
    },
    map: function () {
      this.renderMap()
    }

  }
  ChartFactory.prototype = {
    _next:function () {
      setTimeout(function() {
        var fn = tasks.shift()
        fn&fn()
      },30)
    },
    init: function (opts) {
      this.opts = $.extend(ChartFactory._defaultOpts, opts);
      this.setChartTheme(this.opts.themeType);
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
        wonderland: '../json/wonderland.json', // 配置主题的路径,
        essos:'../json/essos.json'
      }
      $.ajax({
          url:themes[themeType],
          async:false,
          success:function(data){
            obj = data;
            if(themeType){
              echarts.registerTheme(themeType, obj)
            }
          }
      })
      if (!this.opts.id) {
        return
      }
      this.chart = echarts.init(document.getElementById(this.opts.id),themeType);
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