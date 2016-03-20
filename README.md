# ui-grid
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/angular-libs/ui-grid.svg?branch=master)](https://travis-ci.org/angular-libs/ui-grid)
[![Dependency Status](https://gemnasium.com/angular-libs/ui-grid.svg)](https://gemnasium.com/angular-libs/ui-grid)
[![codecov.io](https://codecov.io/github/angular-libs/ui-grid/coverage.svg?branch=master)](https://codecov.io/github/angular-libs/ui-grid?branch=master)
<a href="https://codeclimate.com/github/angular-libs/ui-grid"><img src="https://codeclimate.com/github/angular-libs/ui-grid/badges/gpa.svg" /></a>
[![Coverage Status](https://coveralls.io/repos/angular-libs/ui-grid/badge.svg?branch=master&service=github)](https://coveralls.io/github/angular-libs/ui-grid?branch=master)
[![Bower version](https://badge.fury.io/bo/ng-ui-grid.svg)](https://badge.fury.io/bo/ng-ui-grid)
[![Build status](https://ci.appveyor.com/api/projects/status/vr1h5g5r5wmccrf9/branch/master?svg=true)](https://ci.appveyor.com/project/angular-libs/ui-grid/branch/master)
[![Issue Stats](http://issuestats.com/github/angular-libs/ui-grid/badge/pr)](http://issuestats.com/github/angular-libs/ui-grid)
[![Issue Stats](http://issuestats.com/github/angular-libs/ui-grid/badge/issue)](http://issuestats.com/github/angular-libs/ui-grid)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/angular-libs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/c81ed311241d4e8894996858451ef0a4)](https://www.codacy.com/app/kuldeepkeshwar/ui-grid)
![codecov.io](https://codecov.io/github/angular-libs/ui-grid/branch.svg?branch=master)
[![SensioLabsInsight](https://insight.sensiolabs.com/projects/33b672a9-d02a-469d-9242-e083482de9db/big.png)](https://insight.sensiolabs.com/projects/33b672a9-d02a-469d-9242-e083482de9db)
## ui-grid can be used to create grid with basic functionality like (sort,filter,pagination)

#Installing
#### Bower
```javascript
    bower install ng-ui-grid
    <script src="bower_components/ng-ui-grid/dist/scripts/ui-grid.js"></script>
```
#### CDN

##### You can use rawgit.com's cdn url to access the files in the Bower repository. These files are hosted by MaxCDN. Just alter the version as you need.

* https://rawgit.com/angular-libs/ui-grid/master/dist/scripts/ui-grid.js
* https://rawgit.com/angular-libs/ui-grid/master/dist/scripts/ui-grid.min.js

## Directives :
* **ui-grid** : the core directive for the ui-grid which accept an configuration object.

| Property     | type    | Description |
| :--------|:---------|:-------|
| src  | `string`/`object`   | collection of items, can be array or Url or promise  |
| remote | `boolean`(default: false) |  mark true to enable remote paging |
| manualFilter | `boolean`(default: false) |  mark true to enable to trigger filtering of the records manually |
| listeners | `object` | callback functions
    1). beforeLoadingData : called before loading the records.
    2). afterLoadingData : called after loading the records
|           |         |            |
|:--------|:---------|:-------|
| pager | `object` | paging configuation object e.g  
```javascript
var pager={
        count:20 
    }
```

|           |         |            |
|:--------|:---------|:-------|
| filters | `array` | array of filter object e.g  
```javascript
var filters=[{   
        key:'last_name',
        value:'smith',
        filterfn:function(){...}
    },{   
        key:'city',
        value:'la',
        filterfn:function(){...}
    }]
```
* **ui-grid-filter** : used to apply filters

|  Type    | Description |
| :---------:|:-------:|
| `string`/`object`| can be name of the proptery or filter object with filter function e.g | 

```javascript
    var filter={   
        key:'last_name',
        filterfn:function(){...}
    }
```
* **ui-grid-sort** : used to apply sort

|  Type    | Description |
| :---------:|:-------:|
| `string`/`object`| can be name of the proptery or sorter object with sort function e.g
```javascript
    var sorter={   
        key:'last_name',
        sortfn:function(){...}
    }
```


* **ui-grid-repeat** : responsible for rendering the grid row 
## Usage :
  
### **ui-grid** :
#### HTML
```html
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
##### CODE
```javascript
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
#### HTML
```html
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
#### CODE
```javascript
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
#### HTML
```html
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
#### CODE
```javascript
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

[![Analytics](https://ga-beacon.appspot.com/UA-71806888-2/ui-grid/)](https://github.com/angular-libs/ui-grid)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/angular-libs/ui-grid/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-71806888-2', 'auto');
  ga('send', 'pageview');

</script>


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/angular-libs/ui-grid/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

