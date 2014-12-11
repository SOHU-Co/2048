
window.requestAnimationFrame(function () {
  var gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  console.log(gameManager);
  var options = {
    topics: "sohu",
    token: "35e686f50ffa6c9b645b058c6cd1e693",
    timestamp: "1406545809093",
    appid: "1duvtlet0j"
  };
  var channel = new Channel(options);
  channel.onopen = function () {};
  channel.onmessage = function (msg) {
    var action = JSON.parse(msg.data);
    console.log(action)
    if (action.direction) {
      // gameManager.move(action.direction, action.tile);
      gameManager.storageManager.setGameState(action.gameState);
    } else {
      gameManager.storageManager.setGameState(action.gameState);
      gameManager.setup();
    }
  };
  channel.onerror = function (err) {
    console.log(err)
  };
  channel.onclose = function (reason) {};
});