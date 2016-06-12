/**
 * Created by scg on 16-5-22.
 */
var Login = angular.module('Login', []);
Login.controller('LoginCtrl', function ($scope, $http, $location,$timeout) {
    $scope.has_err = false;
    $scope.err_msg = "";

    $scope.login = function () {
        var username = $scope.username.trim(),
            password = $scope.password.trim();
        if (!username || !password) {
            $scope.err_msg = "请将字段填写完整！";
            $scope.has_err = true;
            $scope.success = false;
            return false;
        }
        $http.post('/api/user/exist', {
            name: username,
            password: password
        }).then(function (data) {
            if (data.data.result == 'success') {
                $scope.err_msg = "登录成功，1s后跳转至聊天室！";
                $scope.has_err = true;
                $scope.success = true;
                
                var user = data.data.user;
                
                $timeout(function () {
                    $scope.err_msg = "";
                    $scope.has_err = false;
                    $location.path('/home').search({
                        'username':username,
                        'userid':user._id
                    });
                },1000);

            } else {
                $scope.err_msg = data.data.result;
                $scope.has_err = true;

            }
        }, function (err) {
            console.log('login error '+err);
        });


    };
    $scope.go_register = function () {
        $location.path('/register');
    };
    $scope.go_main = function () {
        $location.path('/home');
    };

});

export default Login;