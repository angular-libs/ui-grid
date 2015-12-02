'use strict';

describe('Directive: uiGridSort', function () {

  var scope,element;
  beforeEach(module('ui.grid'));
  beforeEach(inject(function ($rootScope,$compile,$timeout) {
    scope=$rootScope.$new();
    scope.gridOptions={
      src:[{id:1,name:'b'},{id:2,name:'a'}]
    };
    scope.sorter={
      key:'name',
      order:1,
      sortFn:function(array,sorter){
        array.sort(function(a,b){
          return (a.name< b.name)?sorter.order*1:sorter.order*-1;
        });
      }
    };
    var body=angular.element(document.body);
    element=angular.element('<div ui-grid="gridOptions">' +
                              '<p class="id-sorter" ui-grid-sort="id">Id</p>' +
                              '<p class="name-sorter" ui-grid-sort="sorter">Id</p>' +
                              '<div ui-grid-repeat var="item">' +
                                  '<span class="id" ng-bind="item.id"></span>' +
                                  '<span  class="name" ng-bind="item.name"></span>' +
                              '</div>' +
                            '</div>');
    body.append(element);
    $compile(element)(scope);
    scope.$digest();
    $timeout.flush();
  }));
  afterEach(function(){
    angular.element(document.body).html('');
  });
  xit('should sort with id', inject(function () {
    var sorterEl=angular.element(document.querySelector('.id-sorter'));
    sorterEl.triggerHandler('click');

    var spans=angular.element(document.querySelectorAll('.id'));

    expect(spans.length).toBe(2);
    expect(spans[0].innerHTML).toBe('2');

    sorterEl.triggerHandler('click');
    spans=angular.element(document.querySelectorAll('.id'));

    expect(spans.length).toBe(2);
    expect(spans[0].innerHTML).toBe('1');
  }));
  it('should sort with name', inject(function () {
    var sorterEl=angular.element(document.querySelector('.name-sorter'));
    sorterEl.triggerHandler('click');
    var spans=angular.element(document.querySelectorAll('.name'));

    expect(spans.length).toBe(2);
    expect(spans[0].innerHTML).toBe('a');

    sorterEl.triggerHandler('click');
    spans=angular.element(document.querySelectorAll('.name'));

    expect(spans.length).toBe(2);
    expect(spans[0].innerHTML).toBe('b');
  }));

});
