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
    grid:{
      top:'0%',
      left:'2%',
      right:'2%',
      bottom:'10%',
    },
    legend: {
      show:false,
      orient: 'horizontal',
      x: '10%',
      data: [],
      bottom: "20px",
      show:true,
      icon: 'circle',
      itemWidth:8,
      itemHeight:8,
    },
    series: [{
      name: "",
      type: 'pie',
      radius:'45%',
      center: ['50%','40%'],
    }]
  }
  // 饼图
  var pie = function (obj) {
    var _self = this;
    var data = this.initData(obj)
    var fn = (function (obj) {
      console.log(obj)
      return function () {
        var pie_datas = chartDataFormate.FormateNOGroupData(data);
        var option = {
          legend: {
            show:false,
            icon: 'circle',
            itemWidth:8,
            itemHeight:8,
            data: pie_datas.category
          },
          series: [{
            name: obj.name || "",
            data: pie_datas.data,
            // radius:obj.radius || '50%',
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
    pie:pie
  }
});
  
 
