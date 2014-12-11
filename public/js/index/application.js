var scoreList = []

function compare (s1, s2) {
  if (s1.score < s2.score)
    return 1;
  else if ( s1.score > s2.score )
    return -1;
  else
    return 0;
}

function rankScores (action) {
  var flag = 0;
  for( var index in scoreList ) {
    if( scoreList[index].uid == action.uid ) {
      flag = 1;
      scoreList[index].score = action.gameState.score;
    }
  }
  if( flag != 1 ){
    scoreList.push({uid:action.uid, score:action.gameState.score, username: action.username});
  }

  var board = document.getElementById("board");
  while(board.firstChild){
    board.removeChild(board.firstChild);
  }
  scoreList.sort(compare);
  for ( var index in scoreList) {
    var score = document.createElement("div");
    score.classList.add("affix-score");
    score.textContent = scoreList[index].username + ' : ' + scoreList[index].score;
    score.setAttribute("data-score", scoreList[index].score);
    board.appendChild(score);
  }

}

window.requestAnimationFrame(function () {
  var managers = {};
  // var gameManager = new GameManager('uid', 4, HTMLActuator, LocalStorageManager);
  var socket = this.socket  = io({ query: { dashboard: true } });
  
  socket.on('connect', function () {
    console.log('Dashboard has connected now!');
  });
  socket.on('error', function (err) {
    console.log(err);
  });
  socket.on('login', function (uid) {
    if (managers[uid]) return;
    newGame(uid);
    managers[uid] = new GameManager(uid, 4, HTMLActuator, LocalStorageManager);
  });
  socket.on('move', function (action) {
    rankScores(action);
    var gameManager = managers[action.uid];
    if (!gameManager) return;
    if (action.direction !== undefined) {
      gameManager.move(action.direction, action.tile);
      gameManager.storageManager.setGameState(action.gameState);
    } else {
      var gameover = document.querySelector('#id' + action.uid + ' .game-over');
      if (gameover) gameover.style.display = 'none';
      gameManager.storageManager.setGameState(action.gameState);
      gameManager.setup();
    }
  });
  socket.on('emoji', function (emoji) {
    var container = document.getElementById("id" + emoji.uid);
    var comment = document.createElement("div");
    comment.classList.add("emoji");
    var img = document.createElement("img");
    img.setAttribute("src", 'img/emoji/' + emoji.mo + '.png');
    comment.appendChild(img);
    if (container.children[2] != undefined) {
      container.replaceChild( comment , container.children[2]);
    } else {
      container.appendChild(comment);
    }
  });
  socket.on('comment', function (comment) {
    var container = document.getElementById("comment");
    if ( container.childElementCount == 5 ) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }    
    }

    var div = document.createElement("div");
    div.classList.add("comment");
    div.textContent = comment.alias + ": " + comment.comment;
    div.style.right = (Math.random()*25-25) + "%" ;
    div.style.bottom = (Math.random()*50 ) + "%" ;
    container.appendChild(div);
  });
});

function newGame (uid) {
  var container = document.querySelector(".container");
  var gameDiv = document.createElement('div');
  gameDiv.id = 'id' + uid;
  gameDiv.className = 'game-set-container';
  gameDiv.innerHTML = html;
  container.appendChild(gameDiv); 
}

var html = [
  '<div class="heading">',
    ' <div class="scores-container">',
    '   <div class="score-container">0</div>',
    '   <div class="best-container">0</div>',
    ' </div>',
   '</div>',
   '<div class="game-container">',
    ' <div class="game-message">',
    '   <p></p>',
    '   <div class="lower">',
    '       <a class="keep-playing-button">Keep going</a>',
    '     <a class="retry-button">Try again</a>',
    '   </div>',
    ' </div>',
    ' <div class="grid-container">',
    '   <div class="grid-row">',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '   </div>',
    '   <div class="grid-row">',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '   </div>',
    '   <div class="grid-row">',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '   </div>',
    '   <div class="grid-row">',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '     <div class="grid-cell"></div>',
    '   </div>',
    ' </div>',
   '<div class="tile-container">',
     '</div>',
   '</div>'].join('');