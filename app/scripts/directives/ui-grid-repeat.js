'use strict';

/**
 * @ngdoc directive
 * @name ui.grid.directive:uiGridRepeat
 * @description
 * # uiGridRepeat
 */
angular.module('ui.grid')
  .directive('uiGridRepeat', function () {
    var _collectionName='$collection';
    return {
      restrict: 'A',
      require: '^uiGrid',
      template:function(el,attrs){
        var _var=el.attr('var');
        el.removeAttr('ui-grid-repeat');
        el.removeAttr('var');
        delete attrs.uiGridRepeat;
        delete attrs.var;
        el.attr('ng-repeat',_var+' in '+_collectionName);
        return el[0].outerHTML;
      },
      replace:true,
      scope: {},
      compile:function() {
        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {
            scope[_collectionName]=controller.getSource();
          },
          post: angular.noop
        };
      }
    };
  });
