var master_list=[];
for(var k=1;k<=10;k++){
	master_list.push({first_name:'A'+k,last_name:'a'+k,age:k,city:'city'+k})
}

angular.module('gpApp',['ui.grid']);
angular.module('gpApp').controller('TestController',['$scope','$q',function($scope,$q){
	$scope.gridOptions={
		src:function(){
			return master_list;
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
	$scope.add=function(k){
		if(k){
			master_list.push({first_name:k.first_name,last_name:k.last_name,age:k.age,city:k.city});
		}
	}
  $scope.delete=function(p){
    var index=-1;
    for(var a=0;a<master_list.length;a++){
      if(master_list[a].first_name=== p.first_name){
        index=a;
        break;
      }
    }
    if(index!=-1){
      master_list.splice(index,1);
    }

  }
}]);

