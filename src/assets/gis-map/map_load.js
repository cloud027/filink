var script = document.getElementById("map_load");
var JS__FILE__ = script.getAttribute("src");  // 获得当前js文件路径
var home = JS__FILE__.substr(0, JS__FILE__.lastIndexOf("/") + 1); // 地图API主目录
// 地图类型 baidu google
var MAP_TYPE = 'baidu';
// websocket请求协议 wss ws
var WEBSOCKET_PROTOCOL = 'ws';

(function () {
  window.Map_loadScriptTime = (new Date).getTime();
  if (MAP_TYPE === 'baidu') {  // 百度地图
    document.write('<script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=kOyXAhTgxQztZLD6uddERiprSBswsNlc"></script>');

    document.write('<script type="text/javascript" src="' + home + 'b_markerClusterer_new.js"></script>');
    // document.write('<script type="text/javascript" src="' + home + 'b_markerClusterer.js"></script>');
    document.write('<script type="text/javascript" src="' + home + 'b_TextIconOverlay.js"></script>');
    document.write('<script type="text/javascript" src="https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>');
  } else {  // 谷歌地图
    document.write('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCGwT3XelPA7xS3wtyOekwZ6RKCJKV_GKM&libraries=drawing"> </script>');
    document.write('<script src="' + home + 'g_markerClusterer.js"></script>');
  }

})();
