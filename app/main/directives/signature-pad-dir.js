'use strict';
var app = angular.module('myApp')
  .directive('signaturepad', ['$document', 'SignaturePad','MathService', function($document, SignaturePad, MathService) {
    return {
      templateUrl: 'main/templates/signaturePad.html',
      link: function(scope, element, attr) {
        console.log(element.find('canvas')[0]);
        var signaturePad = new SignaturePad(element.find('canvas')[0]);

                 var cancelButton = document.getElementById('clear');
                 var saveButton = document.getElementById('save');

                 cancelButton.addEventListener('click', function (event) {
                   signaturePad.clear();
                 });

                 saveButton.addEventListener('click', function (event) {
                   var data = signaturePad.toDataURL();
                   scope.name = MathService.data;
                    window.open(data);
                   console.log(data);
                 });



// Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible paramters)
        // signaturePad.toDataURL(); // save image as PNG
        // signaturePad.toDataURL("image/jpeg"); // save image as JPEG



        // // Clears the canvas
        // signaturePad.clear();

// Returns true if canvas is empty, otherwise returns false
        signaturePad.isEmpty();

// Unbinds all event handlers
        signaturePad.off();

// Rebinds all event handlers
        signaturePad.on();
      }
    };
  }]);

  app.factory('MathService', function() {
              var mathServ = {};
              return {
                  data: {
                    firstName: 'o',
                    lastName: 'd'
                  }
                  // Other methods or objects can go here
                };
           });
