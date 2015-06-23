angular.module('recipe',[])
	.controller('searchController',function($scope, $rootScope, $cookieStore, recipeService) {		
		$rootScope.loggedIn = loggedin($cookieStore);
		
		$scope.searchRecipe = {
			submit: function(form) {
				recipeService.Search($scope.keyword).then(function (data) {
					$scope.recipes = data;
				});
			}
		}
		
	})
	.controller('createRecipeController',function($scope, $rootScope, $cookieStore, $http, $location, tags, recipeService, Upload, REST_BASE_URL) {
		$rootScope.loggedIn = loggedin($cookieStore);
		if (!$rootScope.loggedIn) {
			$location.path('/login'); 
		}
				
		var imageFiles;		
		$scope.$watch('files', function () {
			imageFiles = $scope.files;
		});
						
		//Cooking Prep time pickers
		var date = new Date();
		date.setHours(24);
		date.setMinutes(0);
		
		$scope.prepTime = date;
		$scope.cookTime = date;

		$scope.prephstep = 1;
		$scope.prepmstep = 1;
		$scope.cookhstep = 1;
		$scope.cookmstep = 1;
				
		//Dynamic form fields for ingredients
		//Pre-filled
		//$scope.ingredients = [{id: 'ingredient1',amount: '2/3', unit: 'grams', ingredient: 'butter'}];
		$scope.ingredients = [{id: 'ingredient1'}];
  
		$scope.addNewIngredient = function() {
			var newItemNo = $scope.ingredients.length+1;
			$scope.ingredients.push({'id':'ingredient'+newItemNo});
		};

		$scope.removeIngredient = function() {
			var lastItem = $scope.ingredients.length-1;
			$scope.ingredients.splice(lastItem);
		};	
		
		//Dynamic form fields for steps
		$scope.steps = [{id: 'step1'}];
  
		$scope.addNewStep = function() {
			var newItemNo = $scope.steps.length+1;
			$scope.steps.push({'id':'step'+newItemNo});
		};

		$scope.removeStep = function() {
			var lastItem = $scope.steps.length-1;
			$scope.steps.splice(lastItem);
		};	
		
		//Tags
		$scope.loadTags = function(query) {
			return tags.load(query);
		};
		
		$scope.createRecipe = {
			submit: function(form) {
		
				if (form.$valid) {
				
					var newRecipe = processInputs($scope);
										
					recipeService.Create(newRecipe).then(function (data) {
												
						recipe_ret = false;
						image_ret = true;
					
						if (data.id > 0) {
						
							recipe_ret = true;	
						
							//Save images
							if (imageFiles && imageFiles.length) {
								for (var i = 0; i < imageFiles.length; i++) {
									var file = imageFiles[i];
							
									Upload.upload({
										url: REST_BASE_URL + '/recipes/' + data.id + '/image',
										file: file,
										headers: {
											'Content-Type': file.type,
											'Authorization': 'Token token='+$cookieStore.get('user').api_key
										}
									}).progress(function (evt) {
										var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
										console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
									}).success(function (data, status, headers, config) {
										if (data.id > 0) {
											console.log('SUCCESS: ' + JSON.stringify(data));
										} else {
											image_ret = false;
											console.log('FAILED: file ' + config.file.name + 'uploaded. Response: ' + data);
										}
										
									});
								}
							}
				
						} else {
							$scope.errorMsg = "Error saving recipe";
						}
						
						if (recipe_ret && image_ret) {
							//redirect to list
							$location.path("/dashboard");
						} else {
							//Stay on page and show error message
						}	
					});
				}
			
			}
		}
		
	})
	.controller('editRecipeController',function($scope, $routeParams, $rootScope, $cookieStore, $http, $location, tags, recipeService, Upload, REST_BASE_URL, IMAGES_BASE_URL) {
		$rootScope.loggedIn = loggedin($cookieStore);
		if (!$rootScope.loggedIn) {
			$location.path('/login'); 
		}
		
		$scope.$watch('files', function () {
			imageFiles = $scope.files;
		});
		
		var recipe_id = $routeParams.id;
		
		$scope.recipe_id = 0;
		recipeService.Show(recipe_id).then(function (data) {
			if (data.id > 0) {
				$scope.recipe_id = data.id;
				
				var imageFiles;		
					
				$scope.title = data.title;
				
				$scope.serves = data.serves;
		
				$scope.prepTime = data.prep_time;
				$scope.cookTime = data.cook_time;

				$scope.prephstep = 1;
				$scope.prepmstep = 1;
				$scope.cookhstep = 1;
				$scope.cookmstep = 1;
				
				var ingredient_id = '';
				$scope.ingredients = [];
				for (var index = 0;index < data.ingredients.length; ++index) {
					ingredient_id = 'ingredient'+data.ingredients[index].sort_order;
					$scope.ingredients.push({id: ingredient_id,amount: data.ingredients[index].amount,unit: data.ingredients[index].unit, ingredient: data.ingredients[index].ingredient});
				}
  
				$scope.addNewIngredient = function() {
					var newItemNo = $scope.ingredients.length+1;
					$scope.ingredients.push({'id':'ingredient'+newItemNo});
				};

				$scope.removeIngredient = function() {
					var lastItem = $scope.ingredients.length-1;
					$scope.ingredients.splice(lastItem);
				};	
		
				var step_id = '';
				$scope.steps = [];
				for (var index = 0;index < data.steps.length; ++index) {
					step_id = 'step'+data.steps[index].sort_order;
					$scope.steps.push({id: step_id,description: data.steps[index].description});
				}
				  
				$scope.addNewStep = function() {
					var newItemNo = $scope.steps.length+1;
					$scope.steps.push({'id':'step'+newItemNo});
				};

				$scope.removeStep = function() {
					var lastItem = $scope.steps.length-1;
					$scope.steps.splice(lastItem);
				};	
				
				$scope.tags = [];
				for (var index = 0;index < data.tags.length; ++index) {
					$scope.tags.push({text: data.tags[index].keyword});
				}
		
				//Tags
				$scope.loadTags = function(query) {
					return tags.load(query);
				};
				
				var image_url;
				$scope.images = [];
				for (var index = 0;index < data.images.length; ++index) {
					image_url = IMAGES_BASE_URL + "/" + data.images[index].recipe_id + "/" + data.images[index].id + "." + data.images[index].extension;
					$scope.images.push({url: image_url, id: data.images[index].id, ext: data.images[index].extension, delete: false});
				}
								
				if (data.published) {
					$scope.published = true;
				} else {
					$scope.published = false;
				}
				
				
			}
		});		
		
		$scope.editRecipe = {
			submit: function(form) {
								
				if (form.$valid && $scope.recipe_id > 0) {
				
					var editRecipe = processInputs($scope);
										
					recipeService.Edit(editRecipe).then(function (data) {
						
						//console.log(JSON.stringify(data));			
																
						recipe_ret = false;
						image_ret = true;
					
						if (data.id > 0) {
						
							recipe_ret = true;	
						
							//Save images
							if (imageFiles && imageFiles.length) {
								for (var i = 0; i < imageFiles.length; i++) {
									var file = imageFiles[i];
							
									Upload.upload({
										url: REST_BASE_URL + '/recipes/' + data.id + '/image',
										file: file,
										headers: {
											'Content-Type': file.type,
											'Authorization': 'Token token='+$cookieStore.get('user').api_key
										}
									}).progress(function (evt) {
										var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
										console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
									}).success(function (data, status, headers, config) {
										if (data.id > 0) {
											console.log('SUCCESS: ' + JSON.stringify(data));
											$location.path("/recipe/"+data.id);
										} else {
											image_ret = false;
											console.log('FAILED: file ' + config.file.name + 'uploaded. Response: ' + data);
										}
										
									});
								}
							} else {
								$location.path("/recipe/"+data.id);
							}
				
						} else {
							$scope.errorMsg = "Error saving recipe";
						}
						
						if (recipe_ret && image_ret) {
							//redirect to list
							
						} else {
							//Stay on page and show error message
						}	
						
					});
					
				}
				
			
			}
			
		}
		
	})
	.controller('showRecipeController',function($scope, $routeParams, $rootScope, $cookieStore, $http, $location, tags, recipeService, Upload, REST_BASE_URL, IMAGES_BASE_URL) {
		$rootScope.loggedIn = loggedin($cookieStore);
		
		var recipe_id = $routeParams.id;
	
		recipeService.Show(recipe_id).then(function (data) {
			$scope.image_base_url = IMAGES_BASE_URL;
			$scope.recipe_id = data.id;
			var timestamp = data.cook_time.split(/[- T : .]/);
			$scope.cook_time = timestamp[3] + ":" + timestamp[4];
			timestamp = data.prep_time.split(/[- T : .]/);
			$scope.prep_time = timestamp[3] + ":" + timestamp[4];
			$scope.recipe = JSON.parse(JSON.stringify(data));
		});

	})
	.controller('showTagRecipeController',function($scope, $routeParams, $rootScope, $cookieStore, $http, $location, tags, tagService, Upload, REST_BASE_URL, IMAGES_BASE_URL) {

		var tag_id = $routeParams.id;
	
		tagService.Show(tag_id).then(function (data) {
			$scope.tag = JSON.parse(JSON.stringify(data));
		});

	});
	
angular.module('user',[])
	.controller('dashboardController',function($scope, $rootScope, $http, $cookieStore, $location, userService) {

		$rootScope.loggedIn = loggedin($cookieStore);
		if ($rootScope.loggedIn) {
			$scope.user = $cookieStore.get('user');
		} else {
			$location.path('/login'); 
		}

		userService.Recipes($scope.user.user_id).then(function (data) {
			$scope.user = JSON.parse(JSON.stringify(data));
		});
		
	})
	.controller('loginController',function(userService, $scope, $rootScope, $http, $cookieStore, $location) {
		$rootScope.loggedIn = loggedin($cookieStore);
		if ($rootScope.loggedIn) {
			$location.path('/dashboard'); 
		} else {
			$location.path('/login'); 
		}
	
		$scope.submit = function(data) {
			if ($scope.loginForm.$valid) {
			
				userService.Login($scope.username,$scope.password)
					.then(function (data) {
						if (data.id > 0) {
							$cookieStore.put('user',data);
							$scope.errorMsg = "";
							$location.path('/dashboard');  
				
						} else {
							$scope.errorMsg = "Invalid Username or Password";
						}
					});
				
			}
		};
	})
	.controller('registerController',function(userService, $scope, $rootScope, $http, $cookieStore, $location) {
		$rootScope.loggedIn = loggedin($cookieStore);
		if ($rootScope.loggedIn) {
			$location.path('/dashboard'); 
		} else {
			$location.path('/login'); 
		}
		
		$scope.submit = function(data) {
			if ($scope.signupForm.$valid) {
			
				userService.Create($scope.username,$scope.email,$scope.password)
					.then(function (data) {
						if (data.id > 0) {
							$cookieStore.put('user',data);
							$scope.errorMsg = "";
							$location.path('/dashboard');  
				
						} else {
							$scope.errorMsg = "Error Registering";
						}
					});
			} else {
				return;
			}
				
		}
	})
	.controller('logoutController',function($scope, $rootScope, $http, $cookieStore, $location) {
		$rootScope.loggedIn = false;
		if ($cookieStore.get('user')) {
			$cookieStore.remove('user');
			$rootScope.loggedIn = false;
		}
		
		$location.path('/');  
	})
	.controller('showUserRecipeController',function($scope, $rootScope, $http, $cookieStore, $location, $routeParams, userService) {
		
		var user_id = $routeParams.id;
		
		userService.Recipes(user_id)
			.then(function (data) {
				$scope.user = JSON.parse(JSON.stringify(data));	
			}); 
	});
	
function loggedin(cookieStore) {
	var ret = false;

	if (cookieStore.get('user') && cookieStore.get('user').user_id > 0) {
		ret = true;
	}
	
	return ret;
}

function processInputs(scope) {
		
	var recipe = {
		"title":scope.title
	};
	
	if ((scope.recipe_id) && (scope.recipe_id) > 0) {
		recipe.id = scope.recipe_id;
	}
	
	var prepTime = new Date(scope.prepTime);
	var prephstep = prepTime.getHours();
	var prepmstep = prepTime.getMinutes();
	
	if ((prephstep) > 0 || (prepmstep) > 0) {
		var prepTime = ("0" + prephstep).slice(-2) + ":" + ("0" + prepmstep).slice(-2) + ":00";
		recipe.prep_time = prepTime;
	}
	
	var cookTime = new Date(scope.cookTime);
	var cookhstep = cookTime.getHours();
	var cookmstep = cookTime.getMinutes();
	
	if ((cookhstep) > 0 || (cookmstep) > 0) {
		var cookTime = ("0" + cookhstep).slice(-2) + ":" + ("0" + cookmstep).slice(-2) + ":00";
		recipe.cook_time = cookTime
	}

	if (!isNaN(scope.serves) && scope.serves > 0) {
		recipe.serves = scope.serves
	}

	var tags = [];
	for(var i = 0, len = scope.tags.length; i < len; i++) {
		tags.push( {"keyword" : scope.tags[i].text});
	}

	recipe.tags = tags

	recipe.ingredients = scope.ingredients

	recipe.steps = scope.steps
	
	recipe.images = scope.images;
							
	recipe.published = 0;
	if (scope.published) {
		recipe.published = 1;
	}

	return recipe;
}