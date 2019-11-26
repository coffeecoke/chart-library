  // 饼图基本配置
define([
  'jquery',
  'echarts',
  'modules/chartDataFormate'
], function($, echarts, chartDataFormate) {
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
  // 饼图
  var pie = function (obj) {
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
            data: pie_datas.data,
          }]
        };
        var pieOptions = $.extend(true, pieCommonOption, option);
        _self.renderChart(pieOptions)
        _self._next()
      }
    })(obj)
    this.tasks.push(fn);
    return this;
  }

  return {
    pieCommonOption: pieCommonOption,
    pie:pie
  }
});
  
 
