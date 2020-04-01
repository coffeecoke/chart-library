import echarts from 'echarts'
import customed from '../jsonJs/customed' //深色主题配置文件
import light from '../jsonJs/light' //浅色主题配置文件
// 配置图表主题
var setChartTheme = function (themeType, opts) {
  var _this = this
  var themes = {
    light: light, // 配置主题的路径,
    customed: customed
  }
  // 获取主题配置
  if (themeType) {
    echarts.registerTheme(themeType, themes[themeType]);
    _this.colors = themes[themeType].color
  }
  if (!opts.id) {
    return
  }
  this.chart = echarts.init(document.getElementById(opts.id), themeType);
}
export default setChartTheme