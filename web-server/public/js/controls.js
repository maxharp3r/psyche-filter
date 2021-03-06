
var CONTROLS = {};

CONTROLS.socket = io.connect(CONFIG.wired_addr);

function SocketCtrl($scope) {

  $scope.emit_words = function() {
    console.log("emit CMD:words", $scope.controls.words);
    var words_array = $scope.controls.words.split(',');
    CONTROLS.socket.emit('CMD:words', words_array);
  }

  $scope.submit_name = function() {
    console.log("emit CMD:words", $scope.controls.name);
    CONTROLS.socket.emit('CMD:name', $scope.controls.name);
  }

  _emit_cmd = function(cmd) {
    console.log("emit CMD:control", cmd);
    CONTROLS.socket.emit('CMD:control', cmd);
  }

  $scope.emit_all_on = function() { _emit_cmd('all_on'); }
  $scope.emit_entry_on = function() { _emit_cmd('entry_on'); }
  $scope.emit_exit_on = function() { _emit_cmd('exit_on'); }
  $scope.emit_all_off = function() { _emit_cmd('all_off'); }
  $scope.emit_debug_on = function() { _emit_cmd('debug_on'); }
  $scope.emit_debug_off = function() { _emit_cmd('debug_off'); }
  $scope.emit_reload = function() { _emit_cmd('reload'); }

}
