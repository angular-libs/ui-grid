# ui-grid

## ui-grid can be used to create grid with basic functionality like (sort,filter,pagination)


## Directives :
**ui-grid** : the core directive for the ui-grid which accept an configuration object.

| Property     | type    | Description |
| --------|---------|-------|
| src  | string/object   | collection of items, can be array or Url or promise  |
| isRemotePaging | boolean(default: false) |  mark true to enable remote paging |
| isManualFilter | boolean(default: false) |  mark true to enable to trigger filtering of the records manually |
| listeners | object | callback functions </br> 1). beforeLoadingData : called before loading the records. </br>2). afterLoadingData : called after loading the records  |
| pager | object | paging configuation object e.g </br> pager:{</br> count:20  </br>}  |


**ui-grid-repeat** : responsible for rendering the grid row </br>
**ui-grid-filter** : used to apply filters</br>
**ui-grid-sort** : used to apply sort</br>

## Usage :
  
### **ui-grid** :
```
<table ui-grid="gridOptions">
		<thead>
			<tr>
				<th>First Name</th>
				<th>Last Name</th>
				<th>Age</th>
				<th>City</th>
			</tr>	
		</thead>
		<tbody>
			<tr ui-grid-repeat var="item">
				<td>{{item.first_name}}</td>
				<td>{{item.last_name}}</td>
				<td>{{item.age}}</td>
				<td>{{item.city}}</td>
			</tr>			
		</tbody>
</table>
```
```
angular.module('myApp',['ui.grid']);
angular.module('myApp').controller("myCtrl",function($scope){
    var master_list=[];
	for(var k=1;k<=5000;k++){
		master_list.push({first_name:'A'+k,last_name:'a'+k,age:k,city:'city'+k})
	}
	$scope.gridOptions={
		src:master_list			
	}
});
```

  
### **ui-grid-sort** : accepts property name e.g 'last_name' or Object which has property name and sort function.
```
<table ui-grid="gridOptions">
		<thead>
			<tr>
				th ui-grid-sort='sort1'>First Name</th>
				<th ui-grid-sort='last_name'>Last Name</th>
				<th ui-grid-sort='age'>Age</th>
				<th ui-grid-sort='city'>City</th>
			</tr>	
		</thead>
		<tbody>
			<tr ui-grid-repeat var="item">
				<td>{{item.first_name}}</td>
				<td>{{item.last_name}}</td>
				<td>{{item.age}}</td>
				<td>{{item.city}}</td>
			</tr>			
		</tbody>
</table>
```
```
angular.module('myApp',['ui.grid']);
angular.module('myApp').controller("myCtrl",function($scope){
    var master_list=[];
	for(var k=1;k<=5000;k++){
		master_list.push({first_name:'A'+k,last_name:'a'+k,age:k,city:'city'+k})
	}
	$scope.gridOptions={
		src:master_list			
	}
	$scope.sort1={
		key:'first_name',
		sortFn:function(array,sorter,order){
			array.sort();
		}
	}
});
```
### **ui-grid-filter** : accepts property name e.g 'first_name' or Object which has property name and filter function.
```
<table ui-grid="gridOptions">
		<thead>
			<tr>
				th ui-grid-sort='sort1'>First Name</th>
				<th ui-grid-sort='last_name'>Last Name</th>
				<th ui-grid-sort='age'>Age</th>
				<th ui-grid-sort='city'>City</th>
			</tr>	
			<tr>
				<td ><input type="text"  ng-model="filter.first_name" ui-grid-filter='first_name'></td>
				<td ><input type="text"  ng-model="filter.last_name" ui-grid-filter='filter1'></td>
				<td ><input type="text"  ng-model="filter.age" ui-grid-filter='age'></td>
				<td ><input type="text"  ng-model="filter.city" ui-grid-filter='city'></td>
			</tr>
		</thead>
		<tbody>
			<tr ui-grid-repeat var="item">
				<td>{{item.first_name}}</td>
				<td>{{item.last_name}}</td>
				<td>{{item.age}}</td>
				<td>{{item.city}}</td>
			</tr>			
		</tbody>
</table>
```
```
angular.module('myApp',['ui.grid']);
angular.module('myApp').controller("myCtrl",function($scope){
    var master_list=[];
	for(var k=1;k<=5000;k++){
		master_list.push({first_name:'A'+k,last_name:'a'+k,age:k,city:'city'+k})
	}
	$scope.gridOptions={
		src:master_list			
	}
	$scope.sort1={
		key:'first_name',
		sortFn:function(array,sorter,order){
			array.sort();
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
});
```
