'use strict';

describe('Directive: uiGridFilter', function () {

  var scope,element;
  beforeEach(module('ui.grid'));
  beforeEach(inject(function ($rootScope,$compile,$timeout) {
    scope=$rootScope.$new();
    scope.gridOptions={
      src:[{id:1},{id:2}]
    };
    var body=angular.element(document.body);
    element=angular.element('<div ui-grid="gridOptions"><input id="filter" ng-model="filter" ui-grid-filter="id"><div ui-grid-repeat var="item"><span ng-bind="item.id"></span></div></div>');
    body.append(element);
    $compile(element)(scope);
    scope.$digest();
    $timeout.flush();
  }));
  it('should check ui-grid-filter', inject(function () {
    scope.filter=1;
    scope.$digest();
    var spans=element.find('span');
    expect(spans.length).toBe(1);
    expect(spans[0].innerHTML).toBe('1');
  }));
});
