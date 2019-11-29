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
        show: false
      },
      grid:{
        top:'0%',
        left:'2%',
        right:'2%',
        bottom:'10%',
      },
      legend: {
        orient: 'horizontal',
        x: 'center',
        data: [],
        bottom: "40px",
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
        label: {
          normal: {
              show: false
          }
      },
      }]
    }
    // 饼图
    var pie1 = function (obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
        console.log(obj)
        return function () {
          var pie_datas = chartDataFormate.FormateNOGroupData(data);
          var option = {
            legend: {
              show:true,
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
      pieCommonOption: pieCommonOption,
      pie1:pie1
    }
  });
    
   
  