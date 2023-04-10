let ws;

function enterRoom(roomID) {
    ws = new WebSocket("ws://localhost:8080/WSChatServerDemo-1.0-SNAPSHOT/ws/" + roomID)

    document.getElementById("room_title").value = roomID; // Set title to the room code

    ws.onmessage = function (event) {
        console.log(event.data);
        let message = JSON.parse(event.data);
        document.getElementById("log").value += "[" + timestamp() + "] " + message.message + "\n";
    }
}

function addRoom() {
    //let code = document.getElementById("room-code").value;
    let code = Math.floor(Math.random() * 20);
    let table = document.getElementById("room_buttons_table");
    table.innerHTML += "<td><button class=\"room-button\" onclick=\"enterRoom('" + code + "')\"> Room " + code + "</button></td>";
}

function timestamp() {
    let d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}