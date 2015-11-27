'use strict';

describe('Directive: uiGridSort', function () {

  var scope,element;
  beforeEach(module('ui.grid'));
  beforeEach(inject(function ($rootScope,$compile,$timeout) {
    scope=$rootScope.$new();
    scope.gridOptions={
      src:[{id:1},{id:2}]
    };
    var body=angular.element(document.body);
    element=angular.element('<div ui-grid="gridOptions"><p class="sorter" ui-grid-sort="id">Id</p><div ui-grid-repeat var="item"><span ng-bind="item.id"></span></div></div>');
    body.append(element);
    $compile(element)(scope);
    scope.$digest();
    $timeout.flush();
  }));
  it('should check ui-grid-sorter', inject(function () {
    element.find('p').triggerHandler('click');
    var spans=element.find('span');
    expect(spans.length).toBe(2);
    expect(spans[0].innerHTML).toBe('2');

    element.find('p').triggerHandler('click');
    spans=element.find('span');
    expect(spans.length).toBe(2);
    expect(spans[0].innerHTML).toBe('1');
  }));

});
