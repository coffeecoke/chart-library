(function (root, factory) {
  root.a = root.a || factory(Jquery)
})(this, function ($) {
  function ChartFactory(opts) {
    this.init(opts)
    this.initData()
  }
  ChartFactory._defaultOpts = {
    asy: false,
    data: [],
    url:'',

  }
  ChartFactory.prototype.init = function (opts) {
    this.opts= $.extend(ChartFactory._defaultOpts,opts);
  }
  ChartFactory.prototype.initData = function () {
    var _self = this;
    if (this.opts.asy) {
      $.ajax({
        url:this.opts.url,
        type:'post',
        success:function (result) {
          _self.opts.data = result;
          _self.chartDataFormate(_self.opts.data)
        }
      })
      
    } else {
      _self.chartDataFormate(_self.opts.data)
      
    }

  }
  ChartFactory.prototype.setChartConfig = function () {

  }
  ChartFactory.prototype.chartDataFormate = function (data) {

  }
  ChartFactory.prototype.setChartOptionTemplates = function () {

  }

  

  ChartFactory.prototype.renderChart = function () {

  }
  ChartFactory.prototype.renderMap = function () {

  }

  ChartFactory.prototype.resize = function () {

  }


  return ChartFactory
})