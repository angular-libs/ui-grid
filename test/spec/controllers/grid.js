'use strict';

describe('Controller: GridCtrl', function () {

  // load the controller's module
  beforeEach(module('ui.grid'));
  var createController,createScope;

  beforeEach(inject(function ($rootScope, $controller,$timeout) {
    createScope=function(options){
      var _scope=$rootScope.$new();
      _scope.options=options;
      return _scope;
    };
    createController = function(_scope) {
      var _ctrl=$controller('GridCtrl', {
        '$scope': _scope
      });
      $timeout.flush();
      return _ctrl;
    };

  }));
  it('should have same options', function() {
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}]
    });
    var ctrl = createController(_scope);
    var _options=ctrl.getOptions();
    expect(_options).toBe(_scope.options);
  });
  it('should have same source', function() {
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}]
    });
    var ctrl = createController(_scope);

    var _src=ctrl.getSource();
    expect(_src.length).toBe(_scope.options.src.length);
  });
  it('should check for remote grid', function() {
    var _scope=createScope({
      load:angular.noop,
      remote:true
    });
    var ctrl = createController(_scope);
    expect(ctrl.isRemoteGrid()).toBe(true);
  });
  it('should register filter', function() {
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}],
      filters:[{
        key:'name',
        value:'a'
      }]
    });
    var ctrl = createController(_scope);

    var _src=ctrl.getSource();
    expect(_src.length).toBe(1);

    ctrl.updateFilter('name','z');
    _src=ctrl.getSource();
    expect(_src.length).toBe(0);

    ctrl.updateFilter('name');
    _src=ctrl.getSource();
    expect(_src.length).toBe(_scope.options.src.length);
  });
  it('should apply filter manually ', function() {
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}],
      manualFilter:true,
      filters:[{
        key:'name',
        value:'a',
        filterFn:function(array,filter,value){
          for(var i = array.length - 1; i >= 0; i--) {
            if(value && array[i][filter.key]!==value){
              array.splice(i, 1);
            }
          }
        }
      }]
    });
    var ctrl = createController(_scope);

    var _src=ctrl.getSource();
    expect(_src.length).toBe(_scope.options.src.length);

    _scope.options.applyFilter();
    _src=ctrl.getSource();
    expect(_src.length).toBe(1);

    ctrl.updateFilter('name');// will not filter results
    _scope.options.applyFilter();
    _src=ctrl.getSource();
    expect(_src.length).toBe(_scope.options.src.length);
  });
  it('should register filter with filter function', function() {
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}],
      filters:[{
        key:'name',
        value:'a',
        filterFn:function(array,filter,value){
          for(var i = array.length - 1; i >= 0; i--) {
            if(value && array[i][filter.key]!==value){
              array.splice(i, 1);
            }
          }
        }
      }]
    });
    var ctrl = createController(_scope);

    var _src=ctrl.getSource();
    expect(_src.length).toBe(1);

    ctrl.updateFilter('name','z');
    _src=ctrl.getSource();
    expect(_src.length).toBe(0);

    ctrl.updateFilter('name');
    _src=ctrl.getSource();
    expect(_src.length).toBe(_scope.options.src.length);
  });
  it('should not register filter', function() {
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}],
      filters:[{
        value:'a',
        filterFn:function(array,filter,value){
          //console.log(array);
          for(var i = array.length - 1; i >= 0; i--) {
            if(value && array[i][filter.key]!==value){
              array.splice(i, 1);
            }
          }
        }
      }]
    });
    var ctrl = createController(_scope);

    var _src=ctrl.getSource();
    expect(_src.length).toBe(_scope.options.src.length);

  });
  it('should create page',function(){
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}],
      pager:{
        count:1
      }
    });
    var ctrl = createController(_scope);

    var _src=ctrl.getSource();
    expect(_src.length).toBe(1);

    expect(_src[0]).toEqual(_scope.options.src[0]);

  });
  it('should invoke listeners',function(){
    var _scope=createScope({
      src:[{id:1,name:'a'},{id:2,name:'b'}],
      listeners:{
        beforeLoadingData:function(){
          console.log('called');
        },
        afterLoadingData:function(){
          console.log('called 2');
        }
      }
    });
    spyOn(_scope.options.listeners,'beforeLoadingData');
    spyOn(_scope.options.listeners,'afterLoadingData');

    createController(_scope);

    expect(_scope.options.listeners.beforeLoadingData).toHaveBeenCalled();
    expect(_scope.options.listeners.afterLoadingData).toHaveBeenCalled();
  });
  it('should sort source',function(){
    var _scope=createScope({
      src:[{id:1,name:'b'},{id:2,name:'a'}]
    });
    var ctrl = createController(_scope);
    var _sorter={
      key:'name',order:1,sortFn:function(array,sorter){
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
    };
    ctrl.sort(_sorter);
    var _src=ctrl.getSource();
    expect(_src.length).toBe(_scope.options.src.length);

    expect(_src[0].name).toEqual(_scope.options.src[1].name);
  });
});
