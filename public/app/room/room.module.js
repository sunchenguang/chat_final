/**
 * Created by scg on 16-5-26.
 */
var Room = angular.module('Room', []);
Room.controller('RoomCtrl', function ($scope, $http, $location, $timeout) {
    $scope.has_err = false;
    $scope.err_msg = "";


    $scope.register = function () {
        var room_name = $scope.room_name.trim();

        if (!room_name) {
            $scope.err_msg = "请将字段填写完整！";
            $scope.has_err = true;
            $scope.success = false;
            return false;
        }

        // 创建用户
        $http.post('/api/addRoom', {
            room_name: room_name
        }).then(function (data) {
            if (data.data.result == 'success') {
                $scope.err_msg = "房间注册成功，1s后跳转至登录页！";
                $scope.success = true;
                $scope.has_err = true;

                $timeout(function () {
                    $scope.err_msg = "";
                    $scope.has_err = false;
                    $location.path('/login');
                }, 1000);

            } else {
                $scope.has_err = true;
                $scope.err_msg = "房间名已被占用，请更换房间名！";
            }
        }, function (err) {
            console.log('Error happen ' + err);
        });


    };


});


export default Room;