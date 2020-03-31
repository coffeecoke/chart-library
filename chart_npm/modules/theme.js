import echarts from 'echarts'
import customed from '../jsonJs/customed'
import customed11 from '../jsonJs/customed11'
import essos from '../jsonJs/essos'
import wonderland from '../jsonJs/wonderland'
// 配置图表主题
var setChartTheme = function (themeType, opts) {
  var _this = this
  var themes = {
    wonderland: wonderland, // 配置主题的路径,
    customed11: customed11,
    essos: essos,
    customed: customed
  }
  // 获取主题配置
  if (themeType) {
    console.log(customed)
    echarts.registerTheme(themeType, themes[themeType]);
    console.log(themes.themeType)
    _this.colors = themes[themeType].color
  }
  if (!opts.id) {
    return
  }
  this.chart = echarts.init(document.getElementById(opts.id), themeType);
}
export default setChartTheme