
var CONTROLS = {};

CONTROLS.socket = io.connect(CONFIG.server_addr);

function SocketCtrl($scope) {

  $scope.emit_word = function() {
    console.log("emit CMD:word", $scope.controls.word);
    CONTROLS.socket.emit('CMD:word', $scope.controls.word);
  }

  $scope.emit_reload = function() {
    console.log("emit CMD:reload");
    CONTROLS.socket.emit('CMD:reload');
  }

}
