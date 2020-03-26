require.config({
  baseUrl:"./",
  paths:{
      //RequireJS默认假定所有的依赖资源都是JS脚本，因此无需再module ID上再加上js后缀。
      'jquery':"js/jquery-2.1.4.min",
      'chartFactory':'js/chartFactory',
      'echarts':'js/echarts',
      'progressCanvas':'js/progressCanvas',
  }
});