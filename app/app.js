var recipeBook = angular.module('recipeBook', [
	'ngRoute',
	'ngCookies',
	'ui.bootstrap',
	'ngTagsInput',
	'ngFileUpload',
	'recipe',
	'user']);

recipeBook.constant('REST_BASE_URL', '<API URL - See Readme.txt>');
recipeBook.constant('IMAGES_BASE_URL', '<PUBLIC IMAGES URL - See Readme.txt>');
	
recipeBook.config(['$routeProvider',
					'$httpProvider',
	function($routeProvider, $httpProvider) {
	
		$routeProvider
			.when('/', {
				templateUrl: 'views/search.html',
				controller: 'searchController'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'loginController'
			})
			.when('/signup', {
				templateUrl: 'views/signup.html',
				controller: 'registerController'
			})
			.when('/logout', {
				templateUrl: 'views/logout.html',
				controller: 'logoutController'
			})
			.when('/dashboard', {
				templateUrl: 'views/dashboard.html',
				controller: 'dashboardController'
			})
			.when('/recipe/create', {
				templateUrl: 'views/recipe/create.html',
				controller: 'createRecipeController'
			})
			.when('/recipe/:id/edit', {
				templateUrl: 'views/recipe/edit.html',
				controller: 'editRecipeController'
			})
			.when('/recipe/:id', {
				templateUrl: 'views/recipe/show.html',
				controller: 'showRecipeController'
			})
			.when('/tag/:id', {
				templateUrl: 'views/tag/show.html',
				controller: 'showTagRecipeController'
			})
			.when('/user/:id/recipes', {
				templateUrl: 'views/user/recipes.html',
				controller: 'showUserRecipeController'
			});
			
		$httpProvider.defaults.headers.common = {};
		$httpProvider.defaults.headers.post = {};
		$httpProvider.defaults.headers.put = {};
		$httpProvider.defaults.headers.patch = {};
	}
	
]);