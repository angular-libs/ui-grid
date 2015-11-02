'use strict';

describe('Directive: test', function () {

  // load the directive's module
  beforeEach(module('ui.grid'));

  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));
//TODO
  it('should make hidden element visible', inject(function () {
    expect(1).toBe(1);
  }));
});
