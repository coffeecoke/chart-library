  // 饼图基本配置
define([
  'jquery',
  'echarts',
  'modules/chartDataFormate'
], function($, echarts, chartDataFormate) {
  var pieLabelCommonOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}/%)',
      show: true
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
      center: ['50%','45%'],
      // labelLine: {
      //   normal: {
      //       length: 22,
      //       length2: 70,
      //       lineStyle: {
      //           type: 'solid'
      //       }
      //   }

      // },
      label:{
        normal:{
          formatter: (params)=>{
            return '{c|'+params.percent.toFixed(0)+'%}\n' + '{b|'+params.name+'} '
          },
          align: 'center',
          // padding: [0, -56],
          // height: 66,
          rich: {
            b: {
                fontSize: 14,
                lineHeight: 20,
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

  var pieLegendCommonOption = {
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
      height:"20%",
      itemWidth:8,
      itemHeight:8,
      itemGap: 12,
      padding: [30, 60],
      formatter: function(name) {
        let oa = pieLegendCommonOption.series[0].data;
        let total = 0;
        oa.forEach((item, index) => {
            total += item.value;
        });
        for (let i = 0; i < oa.length; i++) {
            if (name == oa[i].name) {
              return name + '  ' + (oa[i].value / total * 100).toFixed(2)+'%';
            }
        }
      },
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

  var pieRingLabelCommonOption = {
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
      // labelLine: {
      //   normal: {
      //       length: 30,
      //       length2: 60,
      //       lineStyle: {
      //           type: 'solid'
      //       }
      //   }

      // },
      label:{
        normal:{
          formatter: (params)=>{
            return '{c|'+params.percent.toFixed(0)+'%}\n' + '{b|'+params.name+'} '
          },
          align: 'center',
          // padding: [0, -56],
          // height: 60,
          rich: {
            b: {
                fontSize: 14,
                lineHeight: 20,
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

  var pieRingLegendCommonOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}/%)',
    },
    legend: {
      orient: 'vertical',
      x: 'center',
      data: [],
      show:true,
      icon: 'circle',
      bottom:30,
      height: "25%",
      itemWidth:8,
      itemHeight:8,
      padding:20,
      formatter: function(name) {
        let oa = pieRingLegendCommonOption.series[0].data;
        let total = 0;
        oa.forEach((item, index) => {
            total += item.value;
        });
        for (let i = 0; i < oa.length; i++) {
            if (name == oa[i].name) {
              return name + '  ' + (oa[i].value / total * 100).toFixed(2)+'%';
            }
        }
      },
    },
    series: [{
      name: "",
      type: 'pie',
      radius:['35%','45%'],
      center: ['50%','30%'],
      label: {
        normal: {
            show: false
        }
    },
    }]
  }

  // 带label的饼图
  var pieLabel = function (obj) {
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
            // radius:obj.radius || '50%',
          }]
        };
        var pieOptions = $.extend(true, pieLabelCommonOption, option);
        _self.renderChart(pieOptions)
        _self._next()
      }
    })(obj)
    this.tasks.push(fn);
    return this;
  }

  // 图例在下方的饼图
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
        var pieOptions = $.extend(true, pieLegendCommonOption, option);
        _self.renderChart(pieOptions)
        _self._next()
      }
    })(obj)
    this.tasks.push(fn);
    return this;
  }

  // 带label的环形图
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
            // radius:obj.radius || '50%',
          }]
        };
        var pieOptions = $.extend(true, pieRingLabelCommonOption, option);
        _self.renderChart(pieOptions)
        _self._next()
      }
    })(obj)
    this.tasks.push(fn);
    return this;
  }

  // 图例在下方的环形图
  var pieRingLegend = function (obj) {
    var _self = this;
    var data = this.initData(obj)
    var fn = (function (obj) {
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
        var pieOptions = $.extend(true, pieRingLegendCommonOption, option);
        _self.renderChart(pieOptions)
        _self._next()
      }
    })(obj)
    this.tasks.push(fn);
    return this;
  }
  return {
    pieLabel:pieLabel,
    pieLegend:pieLegend,
    pieRingLabel:pieRingLabel,
    pieRingLegend:pieRingLegend
  }
});
  
 
