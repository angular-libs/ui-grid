'use strict';

/**
 * @ngdoc directive
 * @name ui.grid.directive:uiGridFilter
 * @description
 * # uiGridFilter
 */
angular.module('ui.grid')
  .directive('uiGridFilter', function (gridUtil,remoteGridUtil) {
    return {
      restrict: 'A',
      require: ['^uiGrid'],
      scope: false,
      link:function(scope, iElement, iAttrs, controllers) {
        var gridCtrl,_filterOption;
        gridCtrl=controllers[0];
        _filterOption=scope.$eval(iAttrs.uiGridFilter);
        if(!angular.isDefined(_filterOption)){
          _filterOption=(gridCtrl.isRemoteGrid())?new remoteGridUtil.RemoteGridFilter(iAttrs.uiGridFilter,''):new gridUtil.GridFilter(iAttrs.uiGridFilter,'',gridUtil.simpleFilterFn);
        }
        gridCtrl.registerFilter(_filterOption);
        scope.$watch(iAttrs.ngModel,function(n,o){
          if(angular.isDefined(n) && n!==o){
            gridCtrl.updateFilter(_filterOption.key,scope.$eval(iAttrs.ngModel));
          }
        });
      }
    };
  });
