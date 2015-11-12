'use strict';

describe('Service: gridUtil', function () {

  // load the service's module
  beforeEach(module('ui.grid'));

  // instantiate service
  var gridUtil,scope,q;
  function _simplefilterFn(array,filter,value){
    var _val,i;
    for(i = array.length - 1; i >= 0; i--) {
      _val=array[i][filter.key]+"";
      if(value && _val.indexOf(value)===-1){
        array.splice(i, 1);
      }
    }
  }
  function _simpleSortFn(array,sorter){
    var key;
    key=sorter.key;
    return array.sort(function(item1,item2){
      if(item1[key]===item2[key]){
        return 0;
      }else{
        return (item1[key]<item2[key])?-1*sorter.order:1*sorter.order;
      }
    });
  }

  beforeEach(inject(function (_gridUtil_,$rootScope,$q) {
    gridUtil = _gridUtil_;
    scope=$rootScope.$new();
    q=$q;
  }));

  it('should filter array', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var _filter={key:'id'};
    var _val=103;
    gridUtil.simpleFilterFn(_arr,_filter,_val);
    expect(_arr.length).toBe(1);
    expect(_arr[0].id).toBe(_val);
  });
  it('should sort array', function () {
    var _arr=[{id:103},{id:107},{id:102},{id:103}];
    var _sorter={key:'id',order:1};
    gridUtil.simpleSortFn(_arr,_sorter);
    expect(_arr.length).toBe(4);
    expect(_arr[0].id).toBe(102);

    _sorter.order=-1;
    gridUtil.simpleSortFn(_arr,_sorter);
    expect(_arr.length).toBe(4);
    expect(_arr[0].id).toBe(107);
  });
  it('should create Grid Filter Object', function () {
    var key='id',value='101';
    var gridFilter=gridUtil.GridFilter(key,value,_simplefilterFn);
    expect(gridFilter.key).toBe(key);
    expect(gridFilter.value).toBe(value);
    expect(gridFilter.filterFn).toBe(_simplefilterFn);
  });
  it('should create Grid Sorter Object', function () {
    var key='id',order=-1;
    var gridSorter=gridUtil.GridSorter(key,_simpleSortFn,order);
    expect(gridSorter.key).toBe(key);
    expect(gridSorter.order).toBe(order);
    expect(gridSorter.sortFn).toBe(_simpleSortFn);
  });
  it('should verify isRemote', function () {
    scope.options={
      remote:true
    };
    expect(gridUtil.isRemoteGrid(scope)).toBe(true);

    scope.options.remote=false;
    expect(gridUtil.isRemoteGrid(scope)).toBe(false);
  });
  it('should create Grid Object', function () {
    var _config={
      pager:{
        count:10
      },
      scope:scope
    };

    var grid=new gridUtil.Grid(_config);
    expect(grid.filters).toBeDefined();
    expect(grid.masterSrc.length).toBe(0);
    expect(grid._masterSrc.length).toBe(0);
    expect(grid.src.length).toBe(0);
    expect(grid.page.length).toBe(0);

    expect(grid.pager).toBe(_config.pager);
    expect(grid.scope).toBe(_config.scope);
  });
  it('should test watcherFn', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var _config={
      pager:{
        count:10
      },
      scope:scope
    };
    scope.options={
      src:_arr,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var grid=new gridUtil.Grid(_config);
    spyOn(grid, 'invokeFilterChain');
    spyOn(grid, 'initPager');
    spyOn(grid, 'getPage');
    grid.watcherFn(scope.options.src);

    expect(grid.masterSrc).toBe(_arr);
    expect(grid.invokeFilterChain).toHaveBeenCalled();
    expect(grid.initPager).toHaveBeenCalled();
    expect(grid.getPage).toHaveBeenCalled();

    var _config2={
      scope:scope
    };
    var grid2=new gridUtil.Grid(_config2);
    spyOn(grid2, 'invokeFilterChain');
    spyOn(grid2, 'initPager');
    spyOn(grid2, 'getPage');
    grid2.watcherFn(scope.options.src);

    expect(grid2.masterSrc).toBe(scope.options.src);
    expect(grid2.invokeFilterChain).toHaveBeenCalled();
    expect(grid2.initPager).not.toHaveBeenCalled();
    expect(grid2.getPage).not.toHaveBeenCalled();

    var grid3=new gridUtil.Grid(_config);
    spyOn(grid3, 'invokeFilterChain');
    spyOn(grid3, 'initPager');
    spyOn(grid3, 'getPage');
    grid3.watcherFn();

    expect(grid3.masterSrc).toBeDefined();
    expect(grid3.invokeFilterChain).not.toHaveBeenCalled();
    expect(grid3.initPager).not.toHaveBeenCalled();
    expect(grid3.getPage).not.toHaveBeenCalled();
  });
  it('should test resetSrc', function () {
    var _arr=[{id:101},{id:102},{id:103}];

    var _config={
      scope:scope
    };
    _config.scope.options={
      src:_arr,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var grid=new gridUtil.Grid(_config);
    grid.watcherFn(scope.options.src);
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    grid.resetSrc();

    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.masterSrc).toEqual(jasmine.arrayContaining(grid._masterSrc));
    expect(grid.src).toEqual(jasmine.arrayContaining(grid.masterSrc));
  });
  it('should test init with array src', function () {
    var _arr=[{id:101},{id:102},{id:103}];

    scope.options={
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      pager:{
        count:2
      },
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    expect(function(){
      grid.init();
    }).toThrowError(TypeError, "src can be promise,array,function only");

    scope.options.src=_arr;
    grid=new gridUtil.Grid(_config);
    grid.init();
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(_config.pager.count);
    expect(angular.isFunction(scope.options.applyFilter)).toBe(true);

  });
  it('should test init with function src', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    scope.options={
      src:function(){
        return _arr;
      },
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(0);

    expect(angular.isFunction(scope.options.applyFilter)).toBe(true);
  });
  it('should test init with promise src which resolves', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var def= q.defer();
    scope.options={
      src:def.promise,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.resolve(_arr);
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(0);

    expect(angular.isFunction(scope.options.applyFilter)).toBe(true);
  });
  it('should test init with promise src which rejects', function () {
    var def= q.defer();
    scope.options={
      src:def.promise,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.reject('some error');
    scope.$digest();
    expect(grid.masterSrc.length).toBe(0);
    expect(grid._masterSrc.length).toBe(0);
    expect(grid.src.length).toBe(0);
    expect(grid.page.length).toBe(0);

    expect(angular.isFunction(scope.options.applyFilter)).toBe(true);
  });
  it('should test initPager', function () {
    var def= q.defer();
    var _arr=[{id:101},{id:102},{id:103}];
    scope.options={
      src:def.promise,
      listeners: {
        beforeLoadingData: angular.noop,
        afterLoadingData: angular.noop
      }
    };
    var _config={
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.resolve(_arr);
    grid.initPager();           // pager is not defined
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);

    var pager={
      count:2
    };
    grid.initPager(pager); // pager is defined
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(pager.count);
    expect(grid.page[0]).toEqual(_arr[0]);
    expect(angular.isFunction(grid.pager.getPage)).toBe(true);
    grid.pager.getPage(2);  // going to page 2
    expect(grid.page[0]).toEqual(_arr[2]);

    grid.pager.getPage(1);  // going to page 1
    expect(grid.page[0]).toEqual(_arr[0]);

    grid.pager.getPage(-1);  // going to page -1, will remain con current page
    expect(grid.page[0]).toEqual(_arr[0]);

    grid.pager.currentPage=0;
    grid.pager.getPage(1);  // going to page 1
    expect(grid.page[0]).toEqual(_arr[0]);

  });
  it('should test invokeFilterChain', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var def= q.defer();
    scope.options={
      src:def.promise,
      manualFilter:false,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      scope:scope
    };
    var _filter={
      key:'id',value:'',filterFn:_simplefilterFn
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.resolve(_arr);
    grid.registerFilter(_filter);
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(0);

    grid.updateFilter(_filter.key,101); //updating filter
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(1);
    expect(grid.page.length).toBe(0);

  });
  it('should test invokeFilterChain with manualFilter as true', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var def= q.defer();
    scope.options={
      src:def.promise,
      manualFilter:true,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      scope:scope
    };
    var _filter={
      key:'id',value:'',filterFn:_simplefilterFn
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.resolve(_arr);
    grid.registerFilter(_filter);
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(0);

    grid.updateFilter(_filter.key,101); //updating filter,but there will be no filtering
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(0);

    scope.options.applyFilter(); //triggering filter
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(1);
    expect(grid.page.length).toBe(0);
  });

  it('should test invokeFilterChain with pager ', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var def= q.defer();
    scope.options={
      src:def.promise,
      manualFilter:true,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      pager:{
        count:2
      },
      scope:scope
    };
    var _filter={
      key:'id',value:'',filterFn:_simplefilterFn
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.resolve(_arr);
    grid.registerFilter(_filter);
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(_config.pager.count);

    grid.updateFilter(_filter.key,101); //updating filter,but there will be no filtering
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(_config.pager.count);

    scope.options.applyFilter(); //triggering filter
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(1);
    expect(grid.page.length).toBe(1);
  });
  it('should test invokeSort', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var def= q.defer();
    scope.options={
      src:def.promise,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.resolve(_arr);
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(0);


    var _sorter={
      key:'id',order:1,sortFn:_simpleSortFn
    };
    grid.invokeSort(_sorter);

    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.src[0]).toEqual(_arr[0]);
    expect(grid.page.length).toBe(0);

    _sorter.order=-1;

    grid.invokeSort(_sorter);
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.src[0]).toEqual(_arr[2]);
    expect(grid.page.length).toBe(0);

  });
  it('should test invokeSort with pager', function () {
    var _arr=[{id:101},{id:102},{id:103}];
    var def= q.defer();
    scope.options={
      src:def.promise,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      }
    };
    var _config={
      pager:{
        count:2
      },
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    def.resolve(_arr);
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(_config.pager.count);


    var _sorter={
      key:'id',order:1,sortFn:_simpleSortFn
    };
    grid.invokeSort(_sorter);

    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.src[0]).toEqual(_arr[0]);
    expect(grid.page.length).toBe(_config.pager.count);

    _sorter.order=-1;

    grid.invokeSort(_sorter);
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.src[0]).toEqual(_arr[2]);
    expect(grid.page.length).toBe(_config.pager.count);

  });
  it('should test getCurrentPageFirstIndex and getCurrentPageLastIndex', function () {
    var _arr=[];
    var _pager={
      count:2
    };
    scope.options={
      src:_arr,
      listeners:{
        beforeLoadingData:angular.noop,
        afterLoadingData:angular.noop
      },
      pager:_pager
    };
    var _config={
      pager:_pager,
      scope:scope
    };
    var grid=new gridUtil.Grid(_config);
    grid.init();
    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(_arr.length);
    expect(scope.options.pager.getCurrentPageFirstIndex()).toBe(0);
    expect(scope.options.pager.getCurrentPageLastIndex()).toBe(0);

    _arr.push({id:101});
    _arr.push({id:102});
    _arr.push({id:103});

    scope.$digest();
    expect(grid.masterSrc.length).toBe(_arr.length);
    expect(grid._masterSrc.length).toBe(_arr.length);
    expect(grid.src.length).toBe(_arr.length);
    expect(grid.page.length).toBe(_config.pager.count);
    expect(scope.options.pager.getCurrentPageFirstIndex()).toBe(1);
    expect(scope.options.pager.getCurrentPageLastIndex()).toBe(2);
    scope.options.pager.getPage(2);

    expect(scope.options.pager.getCurrentPageFirstIndex()).toBe(3);
    expect(scope.options.pager.getCurrentPageLastIndex()).toBe(3);

  });
});
