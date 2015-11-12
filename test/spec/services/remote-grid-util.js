'use strict';

describe('Service: remoteGridUtil', function () {

  // load the service's module
  beforeEach(module('ui.grid'));

  // instantiate service
  var remoteGridUtil;
  beforeEach(inject(function (_remoteGridUtil_) {
    remoteGridUtil = _remoteGridUtil_;
  }));

  xit('should do something', function () {
    expect(3).toBe(3);
  });

});
