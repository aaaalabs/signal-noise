var ub_frame = window.frameElement;
  var div = document.createElement("div");
  div.id = "div-ub-republicworld.com_1695278106394";
  var final_ub_elem = ub_frame.parentNode.parentNode;
  final_ub_elem.parentNode.insertBefore(div, final_ub_elem);
  url = "https://cdn.unibotscdn.com/player/mvp/player.js";
  s1 = document.createElement("script");
  s1.src = url;
  s1.async = "async";
  s1.type = "text/javascript";
  window.parent.document.getElementsByTagName("head")[0].appendChild(s1);
  s1.onload = function () {
    console.log("loaded");
    window.parent.unibots = window.parent.unibots || { cmd: [] };
    window.parent.unibots.cmd.push(function () {
      window.parent.unibotsPlayer("republicworld.com_1695278106394");
    });
  };