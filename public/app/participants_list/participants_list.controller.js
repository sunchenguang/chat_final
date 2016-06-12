class ParticipantsListController {

    constructor(WebSocket,$location) {
        this.participants = [];
        this.WebSocket = WebSocket;
        this.$location = $location;

        this.register();
    }

    register() {
        this.WebSocket.on('new_connection', (data) => {
            this.handleNewConnection(data.participants);
        });

        this.WebSocket.on('user_disconnected', (data) => {
            this.handleUserDisconnected(data.participants);
        });


    }

    handleNewConnection(participants) {
        this.participants = participants;
    }

    handleUserDisconnected(participants) {
        this.participants = participants;
    }

}

ParticipantsListController.$inject = ["WebSocket","$location"];

export default ParticipantsListController;
