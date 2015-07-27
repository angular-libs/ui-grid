var master_list=[];
for(var k=1;k<=5000;k++){
	master_list.push({first_name:'A'+k,last_name:'a'+k,age:k,city:'city'+k})
}

angular.module('gpApp',['ui.grid']);
angular.module('gpApp').controller('TestController',['$scope','$q',function($scope,$q){
	$scope.gridOptions1={
		src:function(){
			return master_list;
		}
	}
	$scope.gridOptions={
		src:master_list,
		pager:{
			count:20
		}
	}
	$scope.gridOptions2={
		src:'someUrl',
		pager:{
			count:10
		}
	}
	$scope.filter1={
		key:'last_name',
		filterFn:function(array,filter,value){
			for(var i = array.length - 1; i >= 0; i--) {
			    if(value && array[i][filter.key]!=value){
		       		array.splice(i, 1);
		 		}
			}
		}
	}
	$scope.sort1={
		key:'first_name',
		sortFn:function(array,sorter,order){
			array.sort();
		}
	}
	$scope.add=function(k){
		if(k){
			master_list.push({first_name:k.first_name,last_name:k.last_name,age:k.age,city:k.city});	
		}
	}
	$scope.delete=function(p){
		var i=master_list.indexOf(p)
		if(i!=-1){
			master_list.splice(i,1);	
		}
		
	}
	$scope.next=function(){
		$scope.gridOptions.pager.getPage($scope.gridOptions.pager.currentPage+1);
	}
	$scope.prev=function(){
		$scope.gridOptions.pager.getPage($scope.gridOptions.pager.currentPage-1);
	}
}]);

