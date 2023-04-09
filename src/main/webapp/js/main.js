let  ws;
function enterRoom(roomID) {
    //let code = document.getElementById("room-code").value;
    ws = new WebSocket("ws://localhost:8080/WSChatServerDemo-1.0-SNAPSHOT/ws/"+roomID)


    ws.onmessage = function (event) {
        console.log(event.data);
        let message = JSON.parse(event.data);
        document.getElementById("log").value += "[" + timestamp() + "] " + message.message + "\n";
        }
}

function addRoom() {
    //let code = document.getElementById("room-code").value;
    let code = "Room" + Math.floor(Math.random()*20);
    let table = document.getElementById("room_buttons_table");
    table.innerHTML += "<td><button onclick=\"enterRoom('"+code+"')\">"+code+"</button></td>";
}

document.getElementById("input").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        let request = {"type":"chat", "msg":event.target.value};
        ws.send(JSON.stringify(request));
        event.target.value = "";
    }
});

function timestamp() {
    let d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}