$(document).ready(function(){
  $.post('/getMapPoint', function(res){
    data = res.data;

    var iconclasses = {
      exclamation: 'font-size: 22px;',
      A: 'font-size: 22px;'
    };
    var map = new L.Map('map', {
      center: [data[0].lat,data[0].lon],
      zoom: 13,
      zoomControl:false,
      leafletControl: false
    });
    L.tileLayer('http://maps.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2spl!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0').addTo(map);
    // L.tileLayer('https://stamen-tiles-c.a.ssl.fastly.net/toner/{z}/{x}/{y}.png').addTo(map);

    data.forEach(function(row){
      var pos = new L.LatLng(row.lat,row.lon);
      var iconclass = iconclasses[row.iconclass]?row.iconclass:'';
      var iconstyle = iconclass?iconclasses[iconclass]:'';
      var icontext = iconclass?'':row.iconclass;

       var icon = L.divIcon({
         className: 'map-marker '+iconclass,
         iconSize:null,
         html:'<div class="icon" style="'+iconstyle+'">'+icontext+'</div><div class="arrow" />',
         iconUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6362/marker.png'
       });

      L.marker(pos).addTo(map).setIcon(L.icon({
        iconUrl: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSItMzEgMCA1MTEgNTEyIiB3aWR0aD0iNTEycHgiPjxwYXRoIGQ9Im0xNTYuNDEwMTU2IDI3MmgxMzkuNDk2MDk0djMwaC0xMzkuNDk2MDk0em0wIDAiIGZpbGw9IiM1YTVhNWEiLz48cGF0aCBkPSJtMzg1LjkwNjI1IDQ4Ni4xOTkyMTktMjAuOTk2MDk0IDIxLjYwMTU2Mi0xMzguOTAyMzQ0LTEzMy41LS41OTc2NTYuNTk3NjU3LTEzOS44MDA3ODEgMTMyLjkwMjM0My0yMC40MDIzNDQtMjEuNjAxNTYyIDEzOC44OTg0MzgtMTMyLjYwMTU2My01OC4xOTkyMTktNTUuNzk2ODc1IDIxLjAwMzkwNi0yMS42MDE1NjIgNTguNSA1Ni4xMDE1NjIuNTk3NjU2LjU5NzY1NyA1OS42OTkyMTktNTYuNjk5MjE5IDIwLjQwMjM0NCAyMS42MDE1NjItNTguNSA1NS43OTY4NzV6bTAgMCIgZmlsbD0iIzVhNWE1YSIvPjxnIGZpbGw9IiM0NDQiPjxwYXRoIGQ9Im0yMjUuNDEwMTU2IDI3Mmg3MC40OTYwOTR2MzBoLTcwLjQ5NjA5NHptMCAwIi8+PHBhdGggZD0ibTM4NS45MDYyNSA0ODYuMTk5MjE5LTIwLjk5NjA5NCAyMS42MDE1NjItMTM4LjkwMjM0NC0xMzMuNS0uNTk3NjU2LjU5NzY1N3YtNDIuNTk3NjU3bC41OTc2NTYuNTk3NjU3IDU5LjY5OTIxOS01Ni42OTkyMTkgMjAuNDAyMzQ0IDIxLjYwMTU2Mi01OC41IDU1Ljc5Njg3NXptMCAwIi8+PHBhdGggZD0ibTM2MS4zNzUgNTAyLjMxNjQwNi0xMzcuNDMzNTk0LTM2NC43NTM5MDYgMjguMDcwMzEzLTEwLjYzMjgxMiAxMzcuNDI5Njg3IDM2NC43NTM5MDZ6bTAgMCIvPjwvZz48cGF0aCBkPSJtODkuNDQxNDA2IDUwMi4zMTY0MDYtMjguMDY2NDA2LTEwLjYzMjgxMiAxMzcuNDI5Njg4LTM2NC43NTM5MDYgMjguMDcwMzEyIDEwLjYzMjgxMnptMCAwIiBmaWxsPSIjNWE1YTVhIi8+PHBhdGggZD0ibTIxMC40MTAxNTYgMGgzMHY3NWgtMzB6bTAgMCIgZmlsbD0iIzVhNWE1YSIvPjxwYXRoIGQ9Im0yMjUuNDEwMTU2IDBoMTV2NzVoLTE1em0wIDAiIGZpbGw9IiM0NDQiLz48cGF0aCBkPSJtMzguMTI4OTA2IDIwOS45MTAxNTZjLTUwLjE3MTg3NS02MC43ODkwNjItNTAuMTcxODc1LTE0OS4wMzEyNSAwLTIwOS44MjAzMTIybDIzLjE0NDUzMiAxOS4xMDE1NjIyYy00MS4wNDY4NzYgNDkuNzE0ODQ0LTQxLjA0Njg3NiAxMjEuOTAyMzQ0IDAgMTcxLjYyMTA5NHptMCAwIiBmaWxsPSIjYThlYmZhIi8+PHBhdGggZD0ibTQxMi42ODc1IDIwOS45MTAxNTYtMjMuMTQ0NTMxLTE5LjEwMTU2MmM0MS4wNDY4NzUtNDkuNzE0ODQ0IDQxLjA0Njg3NS0xMjEuOTAyMzQ0IDAtMTcxLjYyMTA5NGwyMy4xNDQ1MzEtMTkuMDk3NjU2MmM1MC4xNzE4NzUgNjAuNzg5MDYyMiA1MC4xNzE4NzUgMTQ5LjAzMTI1MDIgMCAyMDkuODIwMzEyMnptMCAwIiBmaWxsPSIjNzZlMmY4Ii8+PHBhdGggZD0ibTEyOC4wNzAzMTIgMTMwLjA2MjVjLTYuOTYwOTM3LTEwLjMyODEyNS0xNC4yMjY1NjItMzMuMjM4MjgxIDIuNjIxMDk0LTUzLjYxMzI4MWwyMy4xMTMyODIgMTkuMTAxNTYyYy02LjM5ODQzOCA3Ljc1LTIuMjM4MjgyIDE1LjYxNzE4OC0uODA0Njg4IDE3LjgyODEyNXptMCAwIiBmaWxsPSIjYThlYmZhIi8+PHBhdGggZD0ibTc4LjM4MjgxMiAxNjMuNjk1MzEyYy0xNi4zMjAzMTItMjQuMTQwNjI0LTMzLjM5ODQzNy03Ny43MTA5MzcgNi4wNTA3ODItMTI1LjQ2NDg0M2wyMy4xMTMyODEgMTkuMTA1NDY5Yy0zNS4yNTc4MTMgNDIuNjk5MjE4LTUuNTkzNzUgODcuNjUyMzQzLTQuMzIwMzEzIDg5LjU0Mjk2OHptMCAwIiBmaWxsPSIjYThlYmZhIi8+PHBhdGggZD0ibTMyMC4xMDkzNzUgMTMzLjU2MjUtMjMuMTEzMjgxLTE5LjEwMTU2MmMzLjEzMjgxMi0zLjgwODU5NCA1LjcyNjU2Mi0xMS45ODA0NjkgMC0xOC45MjU3ODJsMjMuMTEzMjgxLTE5LjEwMTU2MmMxNS41IDE4Ljc1MzkwNiAxMS43MzQzNzUgNDIuOTM3NSAwIDU3LjEyODkwNnptMCAwIiBmaWxsPSIjNzZlMmY4Ii8+PHBhdGggZD0ibTM2Ni4zOTg0MzggMTcxLjc2OTUzMS0yMy4xNDQ1MzItMTkuMTA1NDY5YzIyLjgwODU5NC0yNy42MDkzNzQgMjIuODA4NTk0LTY3LjcwMzEyNCAwLTk1LjMyODEyNGwyMy4xNDQ1MzItMTkuMTA1NDY5YzMxLjkzMzU5MyAzOC42ODc1IDMxLjkzMzU5MyA5NC44NTE1NjIgMCAxMzMuNTM5MDYyem0wIDAiIGZpbGw9IiM3NmUyZjgiLz48cGF0aCBkPSJtMjI1LjQxMDE1NiA2MGMtMjQuOTAyMzQ0IDAtNDUgMjAuMDk3NjU2LTQ1IDQ1IDAgMjQuODk4NDM4IDIwLjA5NzY1NiA0NSA0NSA0NSAyNC44OTg0MzggMCA0NS0yMC4xMDE1NjIgNDUtNDUgMC0yNC45MDIzNDQtMjAuMTAxNTYyLTQ1LTQ1LTQ1em0wIDAiIGZpbGw9IiM3NmUyZjgiLz48cGF0aCBkPSJtMjI1LjQxMDE1NiAxNTB2LTkwYzI0Ljg5ODQzOCAwIDQ1IDIwLjA5NzY1NiA0NSA0NSAwIDI0Ljg5ODQzOC0yMC4xMDE1NjIgNDUtNDUgNDV6bTAgMCIgZmlsbD0iIzI1ZDlmOCIvPjxwYXRoIGQ9Im0zMC40MTAxNTYgNDgyaDM5MHYzMGgtMzkwem0wIDAiIGZpbGw9IiM2ZTZlNmUiLz48cGF0aCBkPSJtMjI1LjQxMDE1NiA0ODJoMTk1djMwaC0xOTV6bTAgMCIgZmlsbD0iIzVhNWE1YSIvPjwvc3ZnPgo=', // load your own custom marker image here
        iconSize: [56, 56],
        iconAnchor: [28, 28],
        popupAnchor: [0, -34]
      }));; //reference marker
      L.marker(pos,{icon: icon}).addTo(map);

    });
    $('.leaflet-control a').remove();
  });
});

var sendmessageToYou = function(){
  $.post('/userMessagePost', { msg: $('#message').val(), user: $('#mail').val(), name: $('#name').val() }, function(res){
    console.log(res);
  })
}