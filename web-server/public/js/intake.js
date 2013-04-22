
function IntakeCtrl($scope, $http, $location, $anchorScroll) {
    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    }

    $scope.submitSurvey = function() {
        console.log("process survey", $scope.survey);
    }
}
