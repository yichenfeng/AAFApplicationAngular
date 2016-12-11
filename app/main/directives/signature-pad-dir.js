'use strict';
angular.module('myApp')
  .directive('signaturepad', ['$document', 'SignaturePad', function($document, SignaturePad) {
    return {
      templateUrl: 'main/templates/signaturePad.html',
      link: function(scope, element, attr) {
        console.log(element.find('canvas')[0]);
        var signaturePad = new SignaturePad(element.find('canvas')[0]);
// Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible paramters)
        signaturePad.toDataURL(); // save image as PNG
        signaturePad.toDataURL("image/jpeg"); // save image as JPEG

// Draws signature image from data URL
//         signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...");

// Clears the canvas
        signaturePad.clear();

// Returns true if canvas is empty, otherwise returns false
        signaturePad.isEmpty();

// Unbinds all event handlers
        signaturePad.off();

// Rebinds all event handlers
        signaturePad.on();
      }
    };
  }])
;
