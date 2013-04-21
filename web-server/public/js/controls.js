
var CONTROLS = {};

CONTROLS.socket = io.connect(CONFIG.server_addr);

function SocketCtrl($scope) {

  $scope.emit_words = function() {
    console.log("emit CMD:words", $scope.controls.words);
    CONTROLS.socket.emit('CMD:words', $scope.controls.words);
  }

  $scope.emit_reload = function() {
    console.log("emit CMD:reload");
    CONTROLS.socket.emit('CMD:reload');
  }

}
