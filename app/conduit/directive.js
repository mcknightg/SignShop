var angularConduitEditor = function($timeout) {
    return {
        restrict: "E",
        replace: true,
        transclude: false,
        controller: function ($scope,$element, $attrs ,$transclude ) {
            angular.element(document).ready(function() {
                $timeout(function(){
                    console.log("Directive Intialized");
                    window.conduitEditor.init($element);
                    return function (scope, element, attrs, controller) {

                    }
                });
            });
        }
    }
};