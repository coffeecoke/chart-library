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
  $('.mask #jsCode').text(chartFactoryWindow[chartobj].objContent.toString())
  Prism.highlightElement(document.getElementById('jsCode'), true);
  chartFactoryWindow[chartobj].objContent(chartId,'customed');
  $(document).on("click",".theme-list li",function () {
    var chartTheme = $(this).data('theme');
    console.log(chartTheme)
    chartFactoryWindow[chartobj].objContent(chartId,chartTheme)
  })
})
$(document).on("click",".delect",function () {
  $(this).parents(".mask").remove()
})
