  // 饼图基本配置
  define([
    'jquery',
    'echarts',
    'modules/chartDataFormate'
  ], function($, echarts, chartDataFormate) {
    var pieCommonOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {d} %',
      },
      legend: {
        orient: 'vertical',
        x: 'center',
        data: [],
        show:true,
        icon: 'circle',
        bottom:30,
        height: "20%",
        itemWidth:8,
        itemHeight:8,
        padding:20
      },
      series: [{
        name: "",
        type: 'pie',
        radius:'45%',
        center: ['50%','30%'],
        label: {
          normal: {
              show: false
          }
      },
      }]
    }
    // 饼图
    var pieLegend = function (obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
        return function () {
          var pie_datas = chartDataFormate.FormateNOGroupData(data);
          var option = {
            legend: {
              show:true,
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
      pieCommonOption: pieCommonOption,
      pieLegend:pieLegend
    }
  });
    
   
  