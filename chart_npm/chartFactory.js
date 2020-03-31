import _ from 'lodash'
import axios from 'axios'
import chartCommonOption from './modules/chartCommonOption'
import setChartTheme from './modules/theme'

function ChartFactory(opts) {
  this.tasks = []
  this.init(opts)
}
ChartFactory._defaultOpts = {
  id: '' || [],
  asy: false,
  data: [],
  url: '',
  themeType: '',
}
// 各种类型图表胚子
ChartFactory.prototype = {
  _next: function () {
    var fn = this.tasks.shift()
    fn && fn()
  },
  init: function (opts) {
    var _self = this;
    this.id = opts.id
    var fn = (function (opts) {
      return function () {
        _self.opts = _.assign({}, ChartFactory._defaultOpts, opts);
        if(!opts.type || opts.type==='echarts') {
          setChartTheme.call(_self, _self.opts.themeType,_self.opts);
          _self._setChartOption()
          _self._extendxyAxis()
        }else {
        }
        _self._next()
      }
    })(opts)
    this.tasks.unshift(fn)
    setTimeout(function () {
      _self._next();
    }, 0)

  },
  
  // 克隆CommOption，以便给多个实例使用
  _setChartOption: function () {
    this.chartCommonOption = _.cloneDeep(chartCommonOption) //clone
  },
  // 继承线图，柱图类型的x,y坐标
  _extendxyAxis: function () {
    if (this.opts.yAxis || this.opts.xAxis) {
      _.assign(this.chartCommonOption.yAxis, this.opts.yAxis || [])
      _.assign(this.chartCommonOption.xAxis, this.opts.xAxis || [])
    }
  },
  //初始化数据
  initData: function (obj) {
    var data = [];
    if (obj.asy) {
      axios({
        method: 'post',
        url: obj.url
      }).then(function (result) {
        data = result;
      });
      // $.ajax({
      //   url: obj.url,
      //   type: 'post',
      //   async: false,
      //   success: function (result) {
      //     data = result;
      //   }
      // })
    } else {
      data = obj.data
    }
    return data
  },
  chartDataFormate: function (data) {},
  // ChartFactory原型扩展图表api
  use: function (obj) {
    _.assign(ChartFactory.prototype, obj)
  },
  renderChart: function (chartOptions) {
    if (this.tasks && this.tasks.length === 0) {
        this.chart.clear();
        this.chart.setOption(chartOptions)
        this.resize();
    }
  },
  resize: function () {
    var _self = this;
    // $(window).on('resize', function () {
    //   _self.chart.resize()
    // })
  }
}
 export default ChartFactory