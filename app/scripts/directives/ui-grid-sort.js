'use strict';

/**
 * @ngdoc directive
 * @name ui.grid.directive:uiGridSort
 * @description
 * # uiGridSort
 */
angular.module('ui.grid')
  .directive('uiGridSort', function (gridUtil,remoteGridUtil) {
    return {
      restrict: 'A',
      require: '^uiGrid',
      scope: false,
      link:function(scope, iElement, iAttrs, gridCtrl) {
        var _order,_sortOption;
        _sortOption=scope.$eval(iAttrs.uiGridSort);
        _order=1;
        if(!angular.isDefined(_sortOption)){
          _sortOption=(gridCtrl.isRemoteGrid())?new remoteGridUtil.RemoteGridSorter(iAttrs.uiGridSort,_order):new gridUtil.GridSorter(iAttrs.uiGridSort,gridUtil.simpleSortFn,_order);
        }
        iElement.on('click',function(){
          _sortOption.order=_sortOption.order*-1;
          gridCtrl.sort(_sortOption);
          scope.$apply();
        });
      }
    };
  });
