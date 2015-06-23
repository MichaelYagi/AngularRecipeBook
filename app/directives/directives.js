angular.module('myApp', [])
	.directive('validNumber', function() {
	  return {
		require: '?ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
		  if(!ngModelCtrl) {
			return; 
		  }

		  ngModelCtrl.$parsers.push(function(val) {
			if (angular.isUndefined(val)) {
				var val = '';
			}
			var clean = val.replace( /[^0-9]+/g, '');
			if (val !== clean) {
			  ngModelCtrl.$setViewValue(clean);
			  ngModelCtrl.$render();
			}
			return clean;
		  });

		  element.bind('keypress', function(event) {
			if(event.keyCode === 32) {
			  event.preventDefault();
			}
		  });
		}
	  };
	});

angular.module('user')
	.directive('uniqueUsername', ['$http','$rootScope','$cookieStore','REST_BASE_URL', function($http,$rootScope,$cookieStore,REST_BASE_URL) {
		return {
			require: 'ngModel',
			link: function (scope, element, attributes, controller) {
                element.bind('blur', function (e) {
					controller.$setValidity('uniqueUsername', true);
										
					$http({
			  			method: 'post',
			  			url: REST_BASE_URL + '/users/check',
			  			data: 'username='+element.val(),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).success(function(data, status, headers, cfg) {
			  			controller.$setValidity('uniqueUsername', data.response?true:false);
					}).error(function(data, status, headers, cfg) {
			  			controller.$setValidity('uniqueUsername', false);
					});
				});
				
			}
		}
	}])
	.directive('uniqueEmail', ['$http','$rootScope','$cookieStore','REST_BASE_URL', function($http,$rootScope,$cookieStore,REST_BASE_URL) {
		return {
			require: 'ngModel',
			link: function (scope, element, attributes, controller) {
                element.bind('blur', function (e) {
					controller.$setValidity('uniqueEmail', true);
										
					$http({
			  			method: 'post',
			  			url: REST_BASE_URL + '/users/check',
			  			data: 'email='+element.val(),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).success(function(data, status, headers, cfg) {
			  			controller.$setValidity('uniqueEmail', data.response?true:false);
					}).error(function(data, status, headers, cfg) {
			  			controller.$setValidity('uniqueEmail', false);
					});
				});
				
			}
		}
	}])
	.directive('compareTo', [function() {
		return {
			require: 'ngModel',
			scope: {
				otherValue: "=compareTo"
			},
			link: function (scope, element, attributes, controller) {

                controller.$validators.compareTo = function(passValue) {
                	return passValue == scope.otherValue;
            	};
 
            	scope.$watch("otherValue", function() {
                	controller.$validate();
            	});
				
			}
		}
	}]);