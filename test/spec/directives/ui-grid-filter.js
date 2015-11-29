'use strict';

describe('Directive: uiGridFilter', function () {

  var scope;
  beforeEach(module('ui.grid'));
  beforeEach(inject(function ($rootScope,$compile,$timeout) {
    scope=$rootScope.$new();
    scope.gridOptions={
      src:[{id:1,name:'a'},{id:2,name:'b'}]
    };
    scope.nameFilterConfig={
      key:'name',
      filterFn:function(array,filter,value){
        //console.log(array,filter,value);
        for(var i = array.length - 1; i >= 0; i--) {
          if(value && array[i][filter.key]!=value){
            array.splice(i, 1);
          }
        }
        //console.log(array);
      }
    }
    var body=angular.element(document.body);
    var element=angular.element(
      '<div ui-grid="gridOptions">' +
          '<input id="filter" ng-model="filter" ui-grid-filter="id">' +
          '<input id="nameFilter" ng-model="nameFilter" ui-grid-filter="nameFilterConfig">' +
          '<div ui-grid-repeat var="item">' +
              '<span class="id" ng-bind="item.id"></span>' +
              '<span class="name" ng-bind="item.name"></span>' +
          '</div>' +
      '</div>');
    //body.html('');
    body.append(element);
    $compile(element)(scope);
    scope.$digest();
    $timeout.flush();
  }));
  afterEach(function(){
    var body=angular.element(document.body);
    body.html('');
  })
  it('should filter with id', inject(function () {
    var inputEl=angular.element(document.getElementById('filter'));
    inputEl.val(1).triggerHandler('input');
    var spans=angular.element(document.querySelectorAll('.id'));
    expect(spans.length).toBe(1);
    expect(spans.html()).toBe(inputEl.val());

    inputEl.val('').triggerHandler('input');
    spans=angular.element(document.querySelectorAll('.id'));
    expect(spans.length).toBe(2);

  }));
  it('should filter with name', inject(function () {
    var inputEl=angular.element(document.getElementById('nameFilter'));
    inputEl.val('b').triggerHandler('input');

    var spans=angular.element(document.querySelectorAll('.name'));
    expect(spans.length).toBe(1);
    expect(spans.html()).toBe(inputEl.val());

    inputEl.val('').triggerHandler('input');
    spans=angular.element(document.querySelectorAll('.name'));
    expect(spans.length).toBe(2);
  }));
});
