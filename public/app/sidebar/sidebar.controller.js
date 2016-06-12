import Auth from "../auth";


class SidebarController {

    constructor($location, WebSocket, $http) {
        this.$location = $location;
        this.WebSocket = WebSocket;
        this.$http = $http;

        this.getRooms();

    }

    getRooms() {
        this.$http.get("/api/rooms").then(
            (data) => {
                this.rooms = data.data['result'];
            },
            (reason) => {
                console.log("error", reason);
            }
        );


    }

    logout() {
        let socket = this.WebSocket.socket;
        socket.disconnect();
        this.$location.path('/login');
    }

    currentUser() {
        return Auth.getCurrentUser();
    }
}

SidebarController.$inject = ['$location', 'WebSocket', '$http'];

export default SidebarController;
