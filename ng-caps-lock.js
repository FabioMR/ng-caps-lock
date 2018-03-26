(function () {
  'use strict';

  angular.module('ngCapsLock', []).run(['$rootScope', '$document', '$window', '$timeout' function ($rootScope, $document, $window, $timeout) {
    function setCapsLockOn (isOn) {
      $timeout(function() {
        $rootScope.isCapsLockOn = isOn;
      });
    };

    function bindingForAppleDevice () {
      $document.bind("keydown", function (event) {
        if (event.keyCode === 20) { setCapsLockOn(true); }
      });

      $document.bind("keyup", function (event) {
        if (event.keyCode === 20) { setCapsLockOn(false); }
      });

      $document.bind("keypress", function (event) {
        var code = event.charCode || event.keyCode;
        var shift = event.shiftKey;

        if (code > 96 && code < 123) { setCapsLockOn(false); }
        if (code > 64 && code < 91 && !shift) { setCapsLockOn(true); }
      });
    };

    function bindingForOthersDevices () {
      var isKeyPressed = true;

      $document.bind("keydown", function (event) {
        if (event.originalEvent && event.originalEvent.getModifierState) {
          return setCapsLockOn(event.originalEvent.getModifierState('CapsLock'))
        }

        if (!isKeyPressed && event.keyCode === 20) {
          isKeyPressed = true;
          if ($rootScope.isCapsLockOn != null) { setCapsLockOn(!$rootScope.isCapsLockOn); }
        }
      });

      $document.bind("keyup", function (event) {
        if (event.keyCode === 20) { isKeyPressed = false; }
      });

      $document.bind("keypress", function (event) {
        var code = event.charCode || event.keyCode;
        var shift = event.shiftKey;

        if (code > 96 && code < 123) { setCapsLockOn(shift); }
        if (code > 64 && code < 91) { setCapsLockOn(!shift); }
      });
    };

    // Once the window goes out of focus, we can't be sure of the caps lock state
    // so we have to default to not showing.
    $window.addEventListener('blur', function (event) {
      setCapsLockOn(false);
    });

    if (/Mac|iPad|iPhone|iPod/.test(navigator.platform)) {
      bindingForAppleDevice();
    } else {
      bindingForOthersDevices();
    }
  }]);
}());
