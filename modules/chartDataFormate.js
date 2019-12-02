define([
  'jquery',
  'echarts',
  'modules/util'
], function($, echarts, util) {
   // 图表数据格式化
   var FormateNOGroupData = function (data) { //data的格式如上的Result1，这种格式的数据，多用于饼图、单一的柱形图的数据源
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
  }
  var FormateGroupData = function (data, type, is_stack, yAxisIndex) { //data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
    var chart_type = 'line';
    if (type)
      chart_type = type || 'line';
    var xAxis = []
    var group = [];
    var series = [];
    var indicator = [];
    for (var i = 0; i < data.length; i++) {
      xAxis.push(data[i].name)
      group.push(data[i].group)
    }
    
    xAxis = util._unique(xAxis)
    group = util._unique(group)
    for (var i = 0; i < group.length; i++) {
      var temp = [];
      for (var j = 0; j < data.length; j++) {
        if (group[i] == data[j].group) {
          if (type == "map") {
            temp.push({
              name: data[j].name,
              value: data[i].value
            });
          } else if (type == "riskMap") {
            $.each(data[i].dataT, function (key, item) {
              var geoCoord = data[i].geoCoordMap[item.name]
              if (geoCoord) {
                temp.push({
                  name: item.name,
                  value: geoCoord.concat(item.value)
                })
              }
            })
          } else if (type == "radar") {
            indicator.push({
              name: data[j].name,
              max: data[j].max
            })
            temp.push(data[j].value);
          } else if (type == 'scatter') {
            temp.push.apply(temp, data[j].value)
          } {
            temp.push(data[j].value);
          }
        }
      }
      switch (type) {
        case 'bar':
          var series_temp = {
            name: group[i],
            data: temp,
            type: chart_type,
          };
          if (is_stack)
            series_temp = $.extend({}, {
              stack: 'stack'
            }, series_temp);
          break;
        case 'line':
          var series_temp = {
            name: group[i],
            data: temp,
            type: chart_type,
          };
          if (is_stack)
            series_temp = $.extend({}, {
              stack: 'stack'
            }, series_temp);
          break;
        case 'radar':
          var series_temp = {
            name: group[i],
            value: temp
            // type: chart_type,
          };
          break;
        case 'scatter':
          var series_temp = {
            name: group[i],
            data: temp,
            type: chart_type,
            symbol: data[i].symbol,
            symbolSize: data[i].symbolSize
          }
          break;
        case 'riskMap':
          var series_temp = {
            name: group[i],
            data: temp
          }
        default:
        // var series_temp = {
        //   // name: group[i],
        //   // data: temp,
        //   // type: chart_type,
        //   // yAxisIndex:yAxisIndex
        // };
      }
      if (yAxisIndex) {
        series_temp.yAxisIndex = yAxisIndex
      }
      series.push(series_temp);
    }
    return {
      category: group,
      // category: group.length > 1? group : [],
      indicator: util._unique(indicator),
      xAxis: xAxis,
      series: series
    };
  }

  return {
    FormateNOGroupData:FormateNOGroupData,
    FormateGroupData:FormateGroupData
  }
});