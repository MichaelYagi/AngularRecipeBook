angular.module('user')
	.factory('userService', ['$http','$q','$cookieStore','REST_BASE_URL', function($http,$q,$cookieStore,REST_BASE_URL) {

		

		//Example of using api key for each request
		//headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization': 'Token token='+$cookieStore.get('user').api_key}

		return {
			Login: function(username, password) {
				var deferred = $q.defer();
				$http({
					method: 'post',
					url: REST_BASE_URL + '/users/login',
					data: 'username='+username+'&password='+password,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data, status, headers, cfg) {
					deferred.resolve(data);
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Logging In" });
				});		
				
				return deferred.promise;
			},
			Create: function(username, email, password) {
				var deferred = $q.defer();
				$http({
					method: 'post',
					url: REST_BASE_URL + '/users',
					data: 'username='+username+'&email='+email+'&password='+password,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data, status, headers, cfg) {
					deferred.resolve(data);
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Registering" });
				});	
				
				return deferred.promise;
			},
			Recipes: function(user_id) {
				var deferred = $q.defer();

				var api_key = '';
				if ($cookieStore.get('user') && $cookieStore.get('user').id > 0) {
					api_key = $cookieStore.get('user').api_key
				}
		
				$http({
					method: 'get',
					url: REST_BASE_URL + '/users/'+user_id+'/recipes',
					headers: {'Content-Type': 'application/x-www-form-urlencoded','X-Api-Key': api_key}
				}).success(function(data, status, headers, cfg) {
					deferred.resolve(data);
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Registering" });
				});	
			
				return deferred.promise;
			}
		};
	}]);
	
angular.module('recipe')
	.service('tags', ['$http','$q','REST_BASE_URL', function($http,$q,REST_BASE_URL) {
  
		this.load = function(query) {
			var deferred = $q.defer();
		
			$http({
				method: 'get',
				url: REST_BASE_URL + '/tags/search/'+query,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data, status, headers, cfg) {
				var tags = [];
				for(var i = 0, len = data.length; i < len; i++) {
					tags.push( {"text" : data[i].keyword});
				}
			
				deferred.resolve(tags);
			}).error(function(data, status, headers, cfg) {
				deferred.resolve({ id: 0, message: "Error Registering" });
			});	
			
			return deferred.promise;
		};
	}])
	.factory('recipeService', ['$http','$q','$cookieStore','REST_BASE_URL', function($http,$q,$cookieStore,REST_BASE_URL) {

		return {
			Create: function(recipeObject) {
			
				var deferred = $q.defer();
														
				$http({
					method: 'post',
					url: REST_BASE_URL + '/recipes',
					data: 'new_recipe='+JSON.stringify(recipeObject),
					headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization': 'Token token='+$cookieStore.get('user').api_key}
				}).success(function(data, status, headers, cfg) {
					deferred.resolve(data);
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Registering" });
				});	
				
				return deferred.promise;
				
				
			},
			Edit: function(recipeObject) {
			
				var deferred = $q.defer();
			
				var api_key = '';
				if ($cookieStore.get('user') && $cookieStore.get('user').id > 0) {
					api_key = $cookieStore.get('user').api_key
				}
			
				$http({
					method: 'put',
					url: REST_BASE_URL + '/recipes/' + recipeObject.id,
					data: 'edit_recipe='+JSON.stringify(recipeObject),
					headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization': 'Token token='+api_key}
				}).success(function(data, status, headers, cfg) {
					deferred.resolve(data);
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Registering" });
				});	
				
				return deferred.promise;
			},
			Show: function(recipeId) {
				var deferred = $q.defer();
			
				var api_key = '';
				if ($cookieStore.get('user') && $cookieStore.get('user').id > 0) {
					api_key = $cookieStore.get('user').api_key
				}
			
				$http({
					method: 'get',
					url: REST_BASE_URL + '/recipes/'+recipeId,
					headers: {'Content-Type': 'application/x-www-form-urlencoded','X-Api-Key': api_key}
				}).success(function(data, status, headers, cfg) {
					if (data.id > 0) {
						deferred.resolve(data);
					} else {
						deferred.resolve({ id: 0, message: "Error Getting Recipe" });
					}
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Getting Recipe" });
				});	
			
				return deferred.promise;
			},
			Search: function(keyword) {
				var deferred = $q.defer();
				
				$http({
					method: 'get',
					url: REST_BASE_URL + '/recipes/search/'+keyword,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data, status, headers, cfg) {
					deferred.resolve(data);
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Getting Recipe" });
				});	
			
				return deferred.promise;
			}
		};
	}])
	.factory('tagService', ['$http','$q','$cookieStore','REST_BASE_URL', function($http,$q,$cookieStore,REST_BASE_URL) {

		return {
			Show: function(tagId) {
				var deferred = $q.defer();
			
				$http({
					method: 'get',
					url: REST_BASE_URL + '/tags/'+tagId,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data, status, headers, cfg) {
					deferred.resolve(data);
				}).error(function(data, status, headers, cfg) {
					deferred.resolve({ id: 0, message: "Error Getting Recipe" });
				});	
			
				return deferred.promise;
			}
		};
	}]);