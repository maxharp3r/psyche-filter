
function scrollToAnchor(aid) {
    // var aTag = $("a[name='"+ aid +"']");
    // $('html,body').animate({scrollTop: $('#' + aid).offset().top}, 'fast');
    var y = $('#' + aid).offset().top;
    $('body').scrollTop(y);
}

function IntakeCtrl($scope, $http, $location, $anchorScroll) {

    $scope.scrollTo = function(id) {
        // scrollToAnchor(id);
        // this is the native angular way to scroll
        $location.hash(id);
        $anchorScroll();
    }

    $scope.finish = function() {
        $scope.submitSurvey();
        setTimeout(function() {
            $scope.scrollTo('top');
            $scope.survey = {};
        }, 5000);
    }

    $scope.submitSurvey = function() {
        console.log("process survey", $scope.survey);

        $http({
            url: CONFIG.wireless_addr + "/surveys/new",
            method: "POST",
            data: $scope.survey
        }).success(function(data, status, headers, config) {
            $scope.data = data;
        }).error(function(data, status, headers, config) {
            $scope.status = status;
        });
    }
}

