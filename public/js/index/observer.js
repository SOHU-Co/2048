var observer_options = {
      topics: "test",
      token: "77f381783b707205fc96435339948a84",
      timestamp: "1406879229880",
      appid: "1dvb50r4ws"
  };
var observer_channel = new Channel(observer_options);

observer_channel.onmessage = function (msg) {
  var container = document.getElementById("comment");
  if ( container.childElementCount == 5 ) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }    
  }

  var comment = document.createElement("div");
  comment.classList.add("comment");

  comment.textContent = JSON.parse(msg.data).alias + ": " + JSON.parse(msg.data).comment;
  comment.style.right = (Math.random()*25-25) + "%" ;
  comment.style.bottom = (Math.random()*50 ) + "%" ;
  container.appendChild(comment);
  console.log(JSON.parse(msg.data))
};
observer_channel.onerror = function (err) {};
observer_channel.onclose = function (reason) {};


var emoji_options = {
    topics: "test",
    token: "71aba2645083ddeacefd1eb5c27cb60a",
    timestamp: "1406916497008",
    appid: "1dvcunas65"
};
var emoji_channel = new Channel(emoji_options);
emoji_channel.onopen = function () {};
emoji_channel.onmessage = function (msg) {
  var container = document.getElementById("id" + JSON.parse(msg.data).uid);
  
  var comment = document.createElement("div");
  comment.classList.add("emoji");
  var emoji = document.createElement("img");
  emoji.setAttribute("src", 'img/emoji/' + JSON.parse(msg.data).mo + '.png');
  comment.appendChild(emoji);
  if (container.children[2] != undefined) {
    container.replaceChild( comment , container.children[2]);
  } else {
   container.appendChild(comment);
  }
};
emoji_channel.onerror = function (err) {};
emoji_channel.onclose = function (reason) {};