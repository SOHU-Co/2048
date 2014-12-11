var options = {
  topics: 'test,login,move,emoji,comment',
  token: '9413cde4f63cadaddfaf4760d4494cff',
  timestamp: '1418265428455',
  appid: "1e9r71x70q"
};
var channel = new Channel(options);
channel.onopen = function () { 
  console.log('channel dashboard connecting now!');
  channel.send('dashboard')
};
channel.onerror = function (err) { console.log(err)};
channel.onclose = function (reason) { };

var $expand = true;
var $board = document.getElementById('board');
document.getElementById('arrow').onclick = function(event) {
  channel.send('click arrow');
  if ($expand) {
    $board.style.height = 0;
    this.setAttribute('class', 'arrow-down');
  } else {
    $board.style.height = '100%';
    this.setAttribute('class', 'arrow-up');
  }
  $expand = !$expand;
}
