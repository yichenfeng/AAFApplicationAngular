'use strict';
angular.module('myApp')
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            var values = [];

            scope.$watch('uploadFile', function(uploadFile) {
                if(!uploadFile) {
                    return;
                }
                console.log("uploadFile", uploadFile);
                if (!scope.files) {
                    scope.files = [];
                }
                scope.files.push({
                    fileName: uploadFile.filename,
                    description: "",
                    base64String: uploadFile.base64
                });

            }, true);
        }
    };
}]);
