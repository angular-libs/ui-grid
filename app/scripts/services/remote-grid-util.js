'use strict';

/**
 * @ngdoc service
 * @name ui.grid.remoteGridUtil
 * @description
 * # remoteGridUtil
 * Service in the uiGrid.
 */
angular.module('ui.grid')
  .factory('remoteGridUtil', function (gridUtil,$http,$log) {
    function prepareDataRequest(grid){
      var _param,self,_pager;
      self=grid;
      _pager={
        count:self.pager.count,
        page:self.pager.currentPage
      };
      _param={
        pager:_pager//JSON.stringify(_pager)
      };
      if(self.sorter){
        _param.sorter=self.sorter;//JSON.stringify(self.sorter);
      }
      if(self.sorter) {
        _param.filters = self.filters;//JSON.stringify(self.filters);
      }
      return _param;
    }

    var service={};
    function RemoteGrid(config){
      var self=this;
      self.filters=config.filters;
      self.sorter=config.sorter;
      self.masterSrc=[];
      self.pager=config.pager;
      self.scope=config.scope;
      gridUtil.GridPager.prototype.getPage=function(i){//exposing page fn
        self.getPage(i);
      };
    }
    RemoteGrid.prototype.getSource=function(){
      return this.masterSrc;
    };
    RemoteGrid.prototype.updateSource=function(data){
      this.masterSrc.length=0;
      if(data){
        var l=(data.length>this.pager.count)?this.pager.count:data.length;
        for(var x=0;x<l;x++){
          this.masterSrc.push(data[x]);
        }
      }
    };
    RemoteGrid.prototype.init=function(){
      this.updatePager(this.scope.options.pager);

      this.load();
    };
    RemoteGrid.prototype.registerFilter=function(filter){
      if(!this.filters){
        this.filters={};
      }
      this.filters[filter.key]=filter;
    };
    RemoteGrid.prototype.updateFilter=gridUtil.Grid.prototype.updateFilter;
    RemoteGrid.prototype.applyFilter=function(){
      this.pager.currentPage=1;
      this.load();
    };
    RemoteGrid.prototype.invokeSort=function(sortOption){
      this.sorter=new service.RemoteGridSorter(sortOption.key,sortOption.order);
      this.pager.currentPage=1;
      this.load();
    };
    RemoteGrid.prototype.updatePager=function(pager){
      var self=this;
      var _pager=self.scope.options.pager;
      if(pager){
        var _totalPage=(pager.count===0||pager.totalRecordCount===0)?1:Math.ceil(pager.totalRecordCount/_pager.count);
        _pager=new gridUtil.GridPager(_pager.count,_pager.currentPage,_totalPage,pager.totalRecordCount);
      }else{
        _pager=new gridUtil.GridPager(0,1,1,0);
      }
      self.scope.options.pager=_pager;
      self.pager=_pager;
    };

    RemoteGrid.prototype.getPage=function(pageNumber){
      if(pageNumber>0 && pageNumber<=this.pager.totalPageCount){
        this.pager.currentPage=pageNumber;
        this.load();
      }
    };
    RemoteGrid.prototype.load=function(){
      var _param=prepareDataRequest(this);
      var _self=this;
      _self.scope.options.listeners.beforeLoadingData.call(_self,_self.src);
      if(angular.isFunction(_self.scope.options.load)){
        _self.scope.options.load(_self,_param);
        _self.scope.options.listeners.afterLoadingData.call(_self,_self.src);
      }else{
        $http.get(_self.scope.options.src,_param).success(function(resp){
          _self.updateSource(resp.data);
          _self.updatePager(resp.pager);
          _self.scope.options.listeners.afterLoadingData.call(_self,_self.src);
        }).error(function(error){
          $log.error(error);
          _self.updateSource([]);
          _self.updatePager();
          _self.scope.options.listeners.afterLoadingData.call(_self,_self.src);
        });
      }
    };
    service.RemoteGrid=RemoteGrid;
    service.RemoteGridFilter=gridUtil.AbstactGridFilter;
    service.RemoteGridSorter=gridUtil.AbstactGridSorter;

    return service;
  });
