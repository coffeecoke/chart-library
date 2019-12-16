$(".container").on("click", ".box", function () {
  var chartobj = $(this).data('chartobj')
  if(!chartFactoryWindow[chartobj]) {
    return;
  }
  var chartId = 'demoChart';
  var maskBox = '';
  maskBox += '<div class="mask">'
  maskBox += '<div class="left-mask">'
  maskBox += '<pre class="line-numbers">'
  maskBox += '<code class="language-javascript" id="jsCode">'
  maskBox += '</code>'
  maskBox += '</pre>'
  maskBox += '</div>'
  maskBox += '<div class="right-mask">'
  maskBox += '<div class="delect">'
  maskBox += '<img src="./images/del.png" alt="">'
  maskBox += '</div>'
  maskBox += '<div class="module" id="' + chartId + '" style="width:100%;height:600px;"></div>'
  maskBox += '<div class="themeBox">'
  maskBox += '<ul class="theme-list">'
  maskBox += '<li data-theme="customed">主题1</li>'
  maskBox += '<li data-theme="essos">主题2</li>'
  maskBox += '<li data-theme="wonderland">主题3</li>'
  maskBox += '</ul>'
  maskBox += '</div>'
  maskBox += '</div>'
  maskBox += '</div>'
  $(".container").after(maskBox);
  $(".mask").show();
  var codeString = chartFactoryWindow[chartobj].objContent.toString()
  codeString += '\n'
  codeString += 'renderChart("'+chartId+'","customed")'
  $('.mask #jsCode').text(codeString)
  Prism.highlightElement(document.getElementById('jsCode'), true);
  chartFactoryWindow[chartobj].objContent(chartId,'customed');
  $('.theme-list li').on("click",function () {
    var modelChart = echarts.getInstanceByDom(document.getElementById(chartId));
    var chartTheme = $(this).data('theme');
    if(modelChart) {
      echarts.dispose(modelChart);
      chartFactoryWindow[chartobj].objContent(chartId,chartTheme)
    }
  })

  $('.delect').on("click",function () {
    var modelChart = echarts.getInstanceByDom(document.getElementById(chartId));
    if(modelChart) {
      echarts.dispose(modelChart);
    }
    $(this).parents(".mask").remove()
  })
})
$('.boxchart-theme-list span').on('click',function () {
  var theme = $(this).data('theme')
  renderBoxChartTheme(theme)
})
function renderBoxChartTheme (theme) {
  $('.module').each(function () {
    var chartId = $(this).attr('id')
    var chart = echarts.getInstanceByDom(document.getElementById(chartId));
    if(chart) {
      echarts.dispose(chart);
      var chartobj = $(this).parents('.box').data('chartobj')
      chartFactoryWindow[chartobj].objContent(chartId,theme)
    }
  })
}



