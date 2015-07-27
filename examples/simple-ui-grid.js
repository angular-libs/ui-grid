var master_list=[];
for(var k=1;k<=10;k++){
	master_list.push({first_name:'A'+k,last_name:'a'+k,age:k,city:'city'+k})
}

angular.module('gpApp',['ui.grid']);
angular.module('gpApp').controller('TestController',['$scope','$q',function($scope,$q){
	$scope.gridOptions={
		src:master_list //src can be an array/url/promise source
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
}]);

