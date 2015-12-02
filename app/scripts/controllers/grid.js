'use strict';

/**
 * @ngdoc function
 * @name ui.grid.controller:GridCtrl
 * @description
 * # GridCtrl
 * Controller of the uiGrid
 */
angular.module('ui.grid')
  .controller('GridCtrl', function($scope,$timeout,gridUtil,remoteGridUtil){
    var self,grid,defaults;
    defaults=function(options){
      var _defaults={
        src:[],
        filters:[],
        sorter:{},
        remote:false,/// mark true for remote paging
        manualFilter:false, // mark true to apply Filters manually using applyFilter function
        listeners:{
          beforeLoadingData:angular.noop,
          afterLoadingData:angular.noop
        }
      };
      var _pager={
        count:0,
        totalRecordCount:0
      };
      var _filter={
        filterFn:gridUtil.simpleFilterFn
      };
      if(options.listeners){
        options.listeners=angular.extend(_defaults.listeners,options.listeners);
      }
      options=angular.extend(_defaults,options);
      if(options.pager){
        options.pager=angular.extend(_pager,options.pager);
      }
      if(options.filters && options.filters.length>0){
        for(var a=0;a<options.filters.length;a++){
          if(options.filters[a].key){
            options.filters[a]=angular.extend(_filter,options.filters[a]);
          }else{
            options.filters.splice(a,1);
          }
        }
      }
      return options;
    };

    self=this;
    self.getSource=function(){
      return grid.getSource();
    };
    self.getOptions=function(){
      return $scope.options;
    };
    self.registerFilter=function(filter){
      grid.registerFilter(filter);
    };
    self.updateFilter=function(name,value){
      grid.updateFilter(name,value);
    };
    self.sort=function(sortOption){
      grid.invokeSort(sortOption);
    };
    self.isRemoteGrid=function(){
      return gridUtil.isRemoteGrid($scope);
    };
    $scope.options=defaults($scope.options);
    $scope.options.scope=$scope;
    grid=(gridUtil.isRemoteGrid($scope))?(new remoteGridUtil.RemoteGrid($scope.options)):(new gridUtil.Grid($scope.options));

    $timeout(function(){
      grid.init();
      if($scope.options.filters && $scope.options.filters.length>0){
        for(var a=0;a<$scope.options.filters.length;a++){
          self.registerFilter($scope.options.filters[a]);
        }
      }
    });
    ////exposing applyFilter
    //$scope.options.applyFilter=function(){
    //  grid.applyFilter();
    //};
  });
