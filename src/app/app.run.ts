﻿/**
 * run() run low-level functionality
 * such as authorization, get user info, roles, etc.
 *
 * @param {scope} $rootScope
 * @param {ICurrentUser} currentUser
 * @return {void}
 */

(function(): void {

    'use strict';

    angular
        .module('finApp')
        .run(run);

    run.$inject = ['ionic'];

    function run($ionicPlatform): void {

        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        //TODO: Get these values from the logged user
        //dataConfig.userId = 'id1234';
    }

})();
