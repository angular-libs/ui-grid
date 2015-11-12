'use strict';

/**
 * @ngdoc directive
 * @name ui.grid.directive:uiGrid
 * @description
 * # uiGrid
 */
angular.module('ui.grid')
  .directive('uiGrid', function(){
    return {
      restrict: 'A',
      require: 'uiGrid',
      controller:'GridCtrl',
      scope:{
        options:'=uiGrid'
      }
    };
  });
