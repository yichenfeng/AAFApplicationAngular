'use strict';
angular.module('myApp')
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
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
                    name: uploadFile.filename,
                    size: uploadFile.filesize,
                    base64: uploadFile.base64
                });

            }, true);

            element.bind('change', function () {

                // angular.forEach(element[0].files, function (item) {
                //     var value = {
                //        // File Name
                //         fileName: item.name,
                //         //File Size
                //         size: item.size,
                //         //File URL to view
                //         url: URL.createObjectURL(item),
                //         // File Input Value
                //         _file: item
                //
                //     };
                //     console.log(item);
                //     values.push(value);
                // });
                // scope.$apply(function () {
                //     if (isMultiple) {
                //         modelSetter(scope, values);
                //     } else {
                //         modelSetter(scope, values[0]);
                //     }
                // });
            });
        }
    };
}]);
