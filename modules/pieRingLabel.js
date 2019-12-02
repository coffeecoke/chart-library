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
      
      legend: {
        orient: 'horizontal',
        x: '10%',
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
        radius:['35%','45%'],
        center: ['50%','45%'],
        labelLine: {
          normal: {
              length: 40,
              length2: 60,
              lineStyle: {
                  type: 'solid'
              }
          }
  
        },
        label:{
          normal:{
            formatter: (params)=>{
              return '{c|'+params.percent.toFixed(0)+'%}\n' + '{b|'+params.name+'} '
            },
            align: 'center',
            padding: [0, -56],
            height: 60,
            rich: {
              b: {
                  fontSize: 14,
                  //lineHeight: 20,
                  color: '#fff',
              },
              c: {
                  fontSize: 14,
                  //lineHeight:20,
                  color: '#fff'
              }
  
            }
          }
        }
      }]
    }
    // 饼图
    var pieRingLabel = function (obj) {
      var _self = this;
      var data = this.initData(obj)
      var fn = (function (obj) {
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
              label: {
                normal: {
                    formatter: ['{d|{d}%}','{b|{b}}'].join('\n'),
                    rich: {
                        b: {
                            color: '#fff',
                            fontSize: 12,
                            lineHeight: 20
                        },
                        d: {
                            color: '#d0fffc',
                            fontSize: 14,
                            height: 20
                        },
                    },
                }
            },
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
      pieRingLabel:pieRingLabel
    }
  });
    
   
  