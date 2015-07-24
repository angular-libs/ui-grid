'use strict';
(function(){
	function simpleFilterFn(array,filter,value){
		var _val,i;
		for(i = array.length - 1; i >= 0; i--) {
		    _val=array[i][filter.key]+"";
		    if(value && _val.indexOf(value)==-1){
	       		array.splice(i, 1);
	 		}
		}
	}
	function simpleSortFn(array,sorter){
		var i,key;
		key=sorter.key;
		return array.sort(function(item1,item2){
			i=(item1[key]<item2[key])?-1:1;
			return i*sorter.order;
		});
	}
	function GridFilter(key,value,filterFn){
		return {
			key:key,
			value:value,
			filterFn:filterFn
		}
	}
	function GridSorter(key,sortFn,order){
		return {
			key:key,
			sortFn:sortFn,
			order:order
		}
	}
	function GridPager(count,currentPage,totalPageCount){
		return{
			count:count,
			currentPage:currentPage,
			totalPageCount:totalPageCount,
			totalRecordCount:count*totalPageCount
		};
	}
	function isRemoteGrid(scope){
		return typeof scope.options.src ==='string' && typeof scope.options.pager ==='object';
	}
	function Grid(scope){
		this.filters={};
		this.masterSrc=[];
		this.src=[];
		this.page=[];
		this.pager=undefined;
		this.scope=scope;
		
	}
	Grid.prototype.watcherFn=function(n){//need to change the context
		var _c;
		if(n){
			this.masterSrc=n;
			this.invokeFilterChain();
			_c=this.pager.currentPage;
			this.initPager(this.pager);
			this.getPage(_c);
		}
	}
	Grid.prototype.resetSrc=function(){
		var _src=this.src;
		_src.length=0;
		angular.forEach(this.masterSrc,function(item){
			_src.push(item);
		})	
	} 
	Grid.prototype.init=function(http,log,q){
		var self,_src,_pager,_pomise;
		function watcher(n){
			if(n){
				_pomise.then(function(data){
					self.watcherFn(data);	
				},function(error){
					self.watcherFn([]);
					log.error(error);
				})	
			}
		}
		self=this;
		_src=self.scope.options.src;
		_pager=self.scope.options.pager;
		if(angular.isFunction(_src)){
			_pomise=q.when(_src());
			self.scope.$watchCollection(function(){
				return _src();
			},watcher);	
		}else if(Array.isArray(_src)){
			_pomise=q.when(_src);
			self.scope.$watchCollection('options.src',watcher);	
		}else if(angular.isString(_src)){
			_pomise=q.when(http(_src));
		}else{
			self.masterSrc.length=0;
		}
		self.resetSrc();
		self.initPager(_pager);
		
	}
	Grid.prototype.initPager=function(p){
		var self=this;
		if(p){
			self.scope.options.pager=GridPager(p.count,1,Math.ceil(self.masterSrc.length/p.count));
			self.pager=self.scope.options.pager;
			self.updatePage();
			this.pager.getPage=function(i){//exposing page fn
				self.getPage(i);
			}; 
		}
	}
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
		this.pager.totalPageCount=(_totalPage==0)?1:_totalPage;
	}
	Grid.prototype.invokeFilterChain=function(){
		var self=this;
		self.resetSrc();
		angular.forEach(self.filters,function(filter){
			if(filter.value){ 			//check for empty value
				filter.filterFn(self.src,filter,filter.value);	
			}
		})
	}
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
	}
	Grid.prototype.getPage=function(pageNumber){
		if(pageNumber>0 && pageNumber<=this.pager.totalPageCount){
			this.pager.currentPage=pageNumber;
			this.updatePage();
		}
	}
	Grid.prototype.updateFilter=function(name,value){
		this.filters[name].value=value;
		this.invokeFilterChain();
		if(this.pager){
			this.pager.currentPage=1;
			this.updatePage();	
		}
	}
	Grid.prototype.registerFilter=function(filter){
		this.filters[filter.key]=filter;
	}
	Grid.prototype.getSource=function(){
		return (this.pager)?this.page:this.src;
	}
	function RemoteGridFilter(key,value){
		return {
			key:key,
			value:value
		}
	}
	function RemoteGridSorter(key,order){
		return {
			key:key,
			order:order
		}
	}
	function RemoteGridPager(count,currentPage,totalPageCount){
		return{
			count:count,
			currentPage:currentPage,
			totalPageCount:totalPageCount,
			totalRecordCount:count*totalPageCount
		};
	}
	function RemoteGrid(scope){
		this.filters=undefined;
		this.sorter=undefined;
		this.masterSrc=[];
		this.pager=undefined;
		this.scope=scope;
	}
	RemoteGrid.prototype.getSource=function(){
		return this.masterSrc;
	}
	RemoteGrid.prototype.init=function(http,log,q){
		var _url=this.scope.options.src;
		var _pager=this.scope.options.pager;
	}
	RemoteGrid.prototype.registerFilter=function(filter){
		if(!this.filters){
			this.filters={};	
		} 
		this.filters[filter.key]=filter;
	}
	RemoteGrid.prototype.updateFilter=function(name,value){
		this.filters[name].value=value;
		//make req and update the master src and pager
	}
	RemoteGrid.prototype.invokeSort=function(sortOption){
		//make req and update the master src and pager
	}
	RemoteGrid.prototype.load=function(http,log){
		var _param,self,_pager;
		self=this;
		_pager={
			count:self.pager.count,
			page:self.pager.currentPage
		};
		_param={
			pager:JSON.stringify(_pager)
		}
		if(self.sorter)
			_param['sorter']=JSON.stringify(self.sorter);
		if(self.sorter)
			_param['filters']=JSON.stringify(self.filters);
				
		http({method: 'GET',url: this.scope.options.src,params: _param}).success(function(resp){
			self.masterSrc=resp.data;
		}).error(function(error){
			self.masterSrc.length=0;
		});
	}
	var _gridDirective=['$http','$log','$q',function($http,$log,$q){
		return {
			restrict: 'A',
			require: 'uiGrid',
			controller:['$scope',function($scope){
				var self,grid;
				self=this;
				grid=(isRemoteGrid($scope))?(new RemoteGrid()):(new Grid($scope));
				self.getSource=function(){
					return grid.getSource();
				}
				self.getOptions=function(){
					return $scope.options;
				}
				self.registerFilter=function(filter){
					grid.registerFilter(filter);
				}
				self.updateFilter=function(name,value){
					grid.updateFilter(name,value);
				}
				self.sort=function(sortOption){
					grid.invokeSort(sortOption);
				}
				self.isRemoteGrid=function(){
					return isRemoteGrid($scope);
				}
				grid.init($http,$log,$q);
			}],
			scope:{
				options:'=uiGrid'
			}
		};
	}];
	var _gridFilterDirective=[function(){
		return {
			restrict: 'A',
			require: ['^uiGrid'],
	      	scope: false,
			link:function(scope, iElement, iAttrs, controllers) {
				var gridCtrl,_filterOption;
				gridCtrl=controllers[0];
				_filterOption=scope.$eval(iAttrs.uiGridFilter);
				if(!angular.isDefined(_filterOption)){
					_filterOption=(gridCtrl.isRemoteGrid())?RemoteGridFilter(iAttrs.uiGridFilter,''):GridFilter(iAttrs.uiGridFilter,'',simpleFilterFn);
				}
				gridCtrl.registerFilter(_filterOption);
				scope.$watch(iAttrs.ngModel,function(n,o){
					if(angular.isDefined(n) && n!=o){
						gridCtrl.updateFilter(_filterOption.key,scope.$eval(iAttrs.ngModel));
					}
				});
	        }
		};
	}];
	var _gridSortDirective=[function(){
		return {
			restrict: 'A',
			require: '^uiGrid',
	      	scope: false,
			link:function(scope, iElement, iAttrs, gridCtrl) {
				var _order,_sortOption;
				_sortOption=scope.$eval(iAttrs.uiGridSort);
				_order=1;
				if(!angular.isDefined(_sortOption)){
					_sortOption=(gridCtrl.isRemoteGrid())?RemoteGridSorter(iAttrs.uiGridSort,_order):GridSorter(iAttrs.uiGridSort,simpleSortFn,_order);
				}
				iElement.on('click',function(){
					_sortOption.order=_sortOption.order*-1;
					gridCtrl.sort(_sortOption);
					scope.$apply();
				})
	        }
		};
	}];
	var _gridRepeatDirective=[function(){
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
			compile:function(el,attr) {
				return {
	            	pre: function preLink(scope, iElement, iAttrs, controller) { 
		            	scope[_collectionName]=controller.getSource();
		            },
		            post: function postLink(scope, iElement, iAttrs, controller) { 
		            }
	            }
	        }
		};
	}];
	angular.module('ui.grid',[]);
	angular.module('ui.grid').directive('uiGrid',_gridDirective);
	angular.module('ui.grid').directive('uiGridFilter',_gridFilterDirective);
	angular.module('ui.grid').directive('uiGridRepeat',_gridRepeatDirective);
	angular.module('ui.grid').directive('uiGridSort',_gridSortDirective);
})();