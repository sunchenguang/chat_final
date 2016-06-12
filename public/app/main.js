import './vendor';

import WebSocket from './web_socket';

import 'angular-route'

// directive component
import MessageListModule from './message_list/message_list.module';
import MessageFormModule from './message_form/message_form.module';
import ParticipantsListModule from './participants_list/participants_list.module';
import SidebarModule from './sidebar/sidebar.module';
import AvatarModule from './avatar/avatar.module';

// page module
import RegisterModule from './register/register.module';
import LoginModule from './login/login.module';
import RoomModule from './room/room.module';


let mainModule = angular.module('mainApp', [
    MessageListModule.name,
    MessageFormModule.name,
    ParticipantsListModule.name,
    SidebarModule.name,
    AvatarModule.name,

    RegisterModule.name,
    LoginModule.name,
    RoomModule.name,
    'ngRoute'


]).service(WebSocket.name, WebSocket);

mainModule.controller('MainCtrl', function ($scope, $location) {
    var qs = $location.search();
    var name = qs['username'];
    var userid = qs['userid'];

    $scope.current_user = name;
    $scope.userid = userid;

});

mainModule.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: "./app/login/login.html",
            controller: "LoginCtrl"
        })
        .when('/register', {
            templateUrl: "./app/register/register.html",
            controller: "RegisterCtrl"
        })
        .when('/home', {
            templateUrl: '../main.html',
            controller: 'MainCtrl',
            //Secret Sauce
            reloadOnSearch: false
        })
        .when('/room', {
            templateUrl: './app/room/room.html',
            controller: 'RoomCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });
    $locationProvider.html5Mode(true);
});

export default mainModule;
