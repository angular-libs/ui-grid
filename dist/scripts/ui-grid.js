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
			if(item1[key]===item2[key]){
				return 0;
			}else{
				return (item1[key]<item2[key])?-1*sorter.order:1*sorter.order;
			}
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
	function isRemoteGrid(scope){
		return typeof scope.options.src ==='string' && typeof scope.options.pager ==='object' && scope.options.remote===true;
	}
	function Grid(config){
		this.filters={};
		this.masterSrc=[];
		this.src=[];
		this.page=[];
		this.pager=config.pager;
		this.scope=config.scope;
		
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
		if(angular.isFunction(_src.then)){//promise
			_pomise=q.when(_src);
			_pomise.then(function(data){
				self.watcherFn(data);	
			},function(error){
				self.watcherFn([]);
				log.error(error);
			})
		}else if(angular.isFunction(_src)){//function
			_pomise=q.when(_src());
			self.scope.$watchCollection(function(){
				return _src();
			},watcher);	
		}else if(Array.isArray(_src)){//array
			_pomise=q.when(_src);
			self.scope.$watchCollection('options.src',watcher);	
		}else if(angular.isString(_src)){
			_pomise=q.when(http.get(_src));
		}else{
			self.masterSrc.length=0;
		}

		self.scope.options.listeners.beforeLoadingData();
		self.resetSrc();
		self.scope.options.listeners.afterLoadingData();
		self.initPager(_pager);
		
	}
	Grid.prototype.initPager=function(p){
		var self=this;
		if(p){
			self.scope.options.pager=new GridPager(p.count,1,Math.ceil(self.getSource().length/p.count),self.getSource().length);
			self.pager=self.scope.options.pager;
			self.updatePage();
			self.pager.getPage=function(i){//exposing page fn
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
		this.pager.totalRecordCount=this.src.length;
	}
	Grid.prototype.getPage=function(pageNumber){
		if(pageNumber>0 && pageNumber<=this.pager.totalPageCount){
			this.pager.currentPage=pageNumber;
			this.updatePage();
		}
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
	Grid.prototype.applyFilter=function(){
		this.scope.options.listeners.beforeLoadingData();
		this.invokeFilterChain();
		if(this.pager){
			this.pager.currentPage=1;
			this.updatePage();	
		}
		this.scope.options.listeners.afterLoadingData();
	}
	Grid.prototype.updateFilter=function(name,value){
		this.filters[name].value=value;
		if(this.scope.options.manualFilter!=true){
			this.scope.options.applyFilter();
		}
	}
	Grid.prototype.registerFilter=function(filter){
		this.filters[filter.key]=filter;
	}
	Grid.prototype.getSource=function(){
		return (this.pager)?this.page:this.src;
	}

	GridPager.prototype.getCurrentPageFirstIndex=function(){
		if(this.totalRecordCount==0){
			return 0;
		}
		if(this.currentPage==1){
			return 1;
		}else{
			return (this.currentPage-1)*this.count+1;
		}
	}
	GridPager.prototype.getCurrentPageLastIndex=function(){
		if(this.currentPage*this.count<=this.totalRecordCount){
			return this.currentPage*this.count; 
		}else{
			return this.totalRecordCount;
		}
	}
	function GridPager(count,currentPage,totalPageCount,totalRecordCount){
		this.count=count;
		this.currentPage=(currentPage && currentPage>1)?currentPage:1;
		this.totalPageCount=(totalPageCount && totalPageCount>1)?totalPageCount:1;
		this.totalRecordCount=totalRecordCount;
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
	function RemoteGrid(config){
		var self=this;
		self.filters=config.filters;
		self.sorter=config.sorter;
		self.masterSrc=[];
		self.pager=config.pager;
		self.scope=config.scope;
		GridPager.prototype.getPage=function(i){//exposing page fn
			self.getPage(i);
		}; 
	}
	RemoteGrid.prototype.getSource=function(){
		return this.masterSrc;
	}
	RemoteGrid.prototype.updateSource=function(data){
		this.masterSrc.length=0;
		if(data){
			var l=(data.length>this.pager.count)?this.pager.count:data.length;
			for(var x=0;x<l;x++){
				this.masterSrc.push(data[x]);
			}
		}
	}
	RemoteGrid.prototype.init=function(http,log,q){
		this.updatePager(this.scope.options.pager);
		this.helperServices={
			http:http,log:log
		};
		this.load();
	}
	RemoteGrid.prototype.registerFilter=function(filter){
		if(!this.filters){
			this.filters={};	
		} 
		this.filters[filter.key]=filter;
	}
	RemoteGrid.prototype.updateFilter=function(name,value){
		this.filters[name].value=value;
		if(this.scope.options.manualFilter!=true){
			this.scope.options.applyFilter();
		}
	}
	RemoteGrid.prototype.applyFilter=function(){
		this.pager.currentPage=1
		this.load();
	}
	RemoteGrid.prototype.invokeSort=function(sortOption){
		this.sorter=RemoteGridSorter(sortOption.key,sortOption.order);
		this.pager.currentPage=1
		this.load();
	}
	RemoteGrid.prototype.updatePager=function(pager){
		var self=this;
		var _pager=self.scope.options.pager;
		if(pager){
			var _totalPage=(pager.count==0||pager.totalRecordCount==0)?1:Math.ceil(pager.totalRecordCount/_pager.count)
			_pager=new GridPager(_pager.count,_pager.currentPage,_totalPage,pager.totalRecordCount);
		}else{
			_pager=new GridPager(0,1,1,0);
		}
		self.scope.options.pager=_pager;
		self.pager=_pager;
	}

	RemoteGrid.prototype.getPage=function(pageNumber){
		if(pageNumber>0 && pageNumber<=this.pager.totalPageCount){
			this.pager.currentPage=pageNumber;
			this.load();
		}
	}
	RemoteGrid.prototype.prepareDataRequest=function(){
		var _param,self,_pager;
		self=this;
		_pager={
			count:self.pager.count,
			page:self.pager.currentPage
		};
		_param={
			pager:_pager//JSON.stringify(_pager)
		}
		if(self.sorter)
			_param['sorter']=self.sorter;//JSON.stringify(self.sorter);
		if(self.sorter)
			_param['filters']=self.filters;//JSON.stringify(self.filters);
		
		return _param;
	}
	RemoteGrid.prototype.load=function(http,log){
		var _param=this.prepareDataRequest();
		var _self=this;
		_self.scope.options.listeners.beforeLoadingData();
		if(angular.isFunction(_self.scope.options.load)){
			_self.scope.options.load(_self,_param);
			_self.scope.options.listeners.afterLoadingData();
		}else{
			_self.helperServices.http.get(_self.scope.options.src,_param).success(function(resp){
				_self.updateSource(resp.data);
				_self.updatePager(resp.pager);
				_self.scope.options.listeners.afterLoadingData();
			}).error(function(error){
				_self.helperServices.log.error(error);
				_self.updateSource([]);
				_self.updatePager();
				_self.scope.options.listeners.afterLoadingData();
			});
		}
	}
	var _gridDirective=['$http','$log','$q',function($http,$log,$q){
		function defaults(options){
			var _defaults={
					src:[],
					filters:{},
					sorter:{},
					remote:false,/// mark true for remote paging
					manualFilter:false, // mark true to apply Filters manually using applyFilter function
					listeners:{
						beforeLoadingData:angular.noop,
						afterLoadingData:angular.noop
					}
				}
			var _pager={
				count:0,
				totalRecordCount:0
			}
			var _filter={
				filterFn:simpleFilterFn
			}
			options=angular.extend(_defaults,options);
			if(options.pager){
				options.pager=angular.extend(_pager,options.pager);
			}
			if(options.filters && options.filters.length>0){
				for(var a=0;a<options.filters.length;a++){
					if(options.filters[a].key){
						options.filters[a]=angular.extend(_filter,options.filters[a])
					}
				}
			}
			return options;
		}
		return {
			restrict: 'A',
			require: 'uiGrid',
			controller:['$scope','$timeout',function($scope,$timeout){
				var self,grid;
				self=this;
				
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
				$scope.options=defaults($scope.options);
				$scope.options.scope=$scope;
				grid=(isRemoteGrid($scope))?(new RemoteGrid($scope.options)):(new Grid($scope.options));
				
				$timeout(function(){
					grid.init($http,$log,$q);
					if($scope.options.filters && $scope.options.filters.length>0){
						for(var a=0;a<$scope.options.filters.length;a++){
							self.registerFilter($scope.options.filters[a]);
						}
					}
				});
				//exposing applyFilter
				$scope.options.applyFilter=function(){
					grid.applyFilter();
				}
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

