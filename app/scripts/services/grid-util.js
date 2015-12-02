'use strict';

/**
 * @ngdoc service
 * @name ui.grid.gridUtil
 * @description
 * # gridUtil
 * Service in the uiGrid.
 */
angular.module('ui.grid')
  .factory('gridUtil', function ($http,$log,$q) {
    var service={};
    service.AbstactGridFilter=function(key,value){
      this.key=key;
      this.value=value;
    };
    service.AbstactGridSorter=function AbstactGridSorter(key,order){
      this.key=key;
      this.order=order;
    };
    service.simpleFilterFn=function(array,filter,value){
      var _val,i;
      for(i = array.length - 1; i >= 0; i--) {
        _val=array[i][filter.key]+"";
        if(value && _val.indexOf(value)===-1){
          array.splice(i, 1);
        }
      }
    };
    service.simpleSortFn=function(array,sorter){
      var key;
      key=sorter.key;
      return array.sort(function(item1,item2){
        if(item1[key]===item2[key]){
          return 0;
        }else{
          return (item1[key]<item2[key])?-1*sorter.order:1*sorter.order;
        }
      });
    };
    service.GridFilter=function(key,value,filterFn){
      var filter=new service.AbstactGridFilter(key,value);
      filter.filterFn=filterFn;
      return filter;
    };
    service.GridSorter=function (key,sortFn,order){
      var sorter=new service.AbstactGridSorter(key,order);
      sorter.sortFn=sortFn;
      return sorter;
    };
    service.isRemoteGrid=function (scope){
      return scope && scope.options && scope.options.remote===true;
    };
    function Grid(config){
      this.filters={};
      this.masterSrc=[];
      this._masterSrc=[];
      this.src=[];
      this.page=[];
      this.pager=config.pager;
      this.scope=config.scope;

    }
    Grid.prototype.watcherFn=function(n){//need to change the context
      var _c;
      if(n){
        this.masterSrc=n;
        this._masterSrc=angular.copy(n);
        this.scope.options.listeners.beforeLoadingData.call(this,this.masterSrc);

        if(this.scope.options.manualFilter!==true){
          this.invokeFilterChain();
        }else{
          this.resetSrc();
        }
        if(this.pager){
          _c=this.pager.currentPage;
          this.initPager(this.pager);
          this.getPage(_c);
        }
        this.scope.options.listeners.afterLoadingData.call(this,this.src);
      }
    };
    Grid.prototype.resetSrc=function(){
      var _src=this.src;
      _src.length=0;
      this.masterSrc=angular.copy(this._masterSrc);
      angular.forEach(this.masterSrc,function(item){
        _src.push(item);
      });
    };
    Grid.prototype.init=function(){
      var self,_src,_pager,_pomise;
      function watcher(n){
        if(n){
          _pomise=$q.when(n);
          _promiseHandler(_pomise);
        }
      }
      function _promiseHandler(pomise){
        pomise.then(function(data){
          self.watcherFn(data);
        },function(error){
          self.watcherFn([]);
          $log.error(error);
        });
      }
      self=this;
      _src=self.scope.options.src;
      _pager=self.scope.options.pager;
      self.scope.options.applyFilter=function(){
        self.applyFilter();
      };
      if(_src && angular.isFunction(_src.then)){//promise
        _pomise=$q.when(_src);
        _promiseHandler(_pomise);
      }else if(angular.isFunction(_src)){//function
        self.scope.$watchCollection(function(){
          return _src();
        },watcher);
      }else if(Array.isArray(_src)) {//array
        self.scope.$watchCollection('options.src', watcher);
      }else{
        throw new TypeError("src can be promise,array,function only");
      }
    };
    Grid.prototype.initPager=function(p){
      var self=this;
      if(p){
        self.scope.options.pager=new GridPager(p.count,1,Math.ceil(self.getSource().length/p.count),self.getSource().length);
        self.pager=self.scope.options.pager;
        self.updatePage();
        self.pager.getPage=function(i){//exposing page fn
          self.getPage(i);
        };
      }
    };
    Grid.prototype.updatePage=function(){
      var _totalPage,_startIndex;
      this.page.length=0;
      _startIndex=(this.pager.currentPage-1)*this.pager.count;
      _startIndex=(_startIndex<0)?0:_startIndex;
      for(var k=1;k<=this.pager.count;k++){
        if(angular.isDefined(this.src[_startIndex])){
          this.page.push(this.src[_startIndex]);
        }
        _startIndex++;
      }
      _totalPage=Math.ceil(this.src.length/this.pager.count);
      this.pager.totalPageCount=(_totalPage===0)?1:_totalPage;
      this.pager.totalRecordCount=this.src.length;
    };
    Grid.prototype.getPage=function(pageNumber){
      if(pageNumber>0 && pageNumber<=this.pager.totalPageCount){
        this.pager.currentPage=pageNumber;
        this.updatePage();
      }
    };
    Grid.prototype.invokeFilterChain=function(){
      var self=this;
      //self.scope.options.listeners.beforeLoadingData.call(self,self.src);
      self.resetSrc();
      angular.forEach(self.filters,function(filter){
        if(filter.value){ 			//check for empty value
          filter.filterFn(self.src,filter,filter.value);
        }
      });
      //self.scope.options.listeners.afterLoadingData.call(self,self.src);

    };
    Grid.prototype.invokeSort=function(sortOption){
      var _l;
      sortOption.sortFn(this.src,sortOption);
      _l=this.src.length;
      this.src.push({});//hack to invoke watchers
      this.src.length=_l;
      if(this.pager){
        this.pager.currentPage=1;
        this.updatePage();
      }
    };
    Grid.prototype.applyFilter=function(){
      this.scope.options.listeners.beforeLoadingData.call(this,this.masterSrc);
      this.invokeFilterChain();
      if(this.pager){
        this.pager.currentPage=1;
        this.updatePage();
      }
      this.scope.options.listeners.afterLoadingData.call(this,this.src);
    };
    Grid.prototype.updateFilter=function(key,value){
      this.filters[key].value=value;
      if(this.scope.options.manualFilter!==true){
        this.scope.options.applyFilter();
      }
    };
    Grid.prototype.registerFilter=function(filter){
      this.filters[filter.key]=filter;
    };
    Grid.prototype.getSource=function(){
      return (this.pager)?this.page:this.src;
    };


    function GridPager(count,currentPage,totalPageCount,totalRecordCount){
      this.count=count;
      this.currentPage=(currentPage && currentPage>1)?currentPage:1;
      this.totalPageCount=(totalPageCount && totalPageCount>1)?totalPageCount:1;
      this.totalRecordCount=totalRecordCount;
    }
    GridPager.prototype.getCurrentPageFirstIndex=function(){
      if(this.totalRecordCount===0){
        return 0;
      }
      if(this.currentPage===1){
        return 1;
      }else{
        return (this.currentPage-1)*this.count+1;
      }
    };
    GridPager.prototype.getCurrentPageLastIndex=function(){
      if(this.currentPage*this.count<=this.totalRecordCount){
        return this.currentPage*this.count;
      }else{
        return this.totalRecordCount;
      }
    };
    service.Grid=Grid;
    service.GridPager=GridPager;
    return service;
  });
