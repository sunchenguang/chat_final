/**
 * Created by scg on 16-5-22.
 */
var Register = angular.module('Register', []);
Register.controller('RegisterCtrl', function ($scope, $http, $location,$timeout) {
    $scope.has_err = false;
    $scope.err_msg = "";
    
    
    $scope.register = function () {
        var username = $scope.username.trim();
        var password = $scope.password.trim();
        if (!username || !password) {
            $scope.err_msg = "请将字段填写完整！";
            $scope.has_err = true;
            $scope.success = false;
            return false;
        }

        // 创建用户
        $http.post('/api/user', {
            name: username,
            password: password
        }).then(function (data) {
            if (data.data.result == 'success') {
                $scope.err_msg = "注册成功，1s后跳转至登录页！";
                $scope.success = true;
                $scope.has_err = true;

                $timeout(function () {
                    $scope.err_msg = "";
                    $scope.has_err = false;
                    $location.path('/login');    
                },1000);
                
            } else {
                $scope.has_err = true;
                $scope.err_msg = "用户名已被占用，请更换用户名！";
                console.log('Register error happen');
            }
        }, function (err) {
            console.log('Error happen ' + err);
        });


    };

    $scope.go_login = function () {
        $location.path('/login');
    };
    $scope.go_main = function () {
        $location.path('/home');
    };
});
export default Register;
