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
    if (event.key === "Enter") {
        let request = {"type":"chat", "msg":event.target.value};
        ws.send(JSON.stringify(request));
        event.target.value = ""; // Clear input box
        //sendMessage(message)
    }
});

function timestamp() {
    let d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}

function sendMsg (msg){
    //var name = ;
    //var date = ;
    //var time = ;
    //document
    //.getElementById("chat_table")
    //    .insertRow(-1) // Last index
    //    .insertCell(0)
    //    .innerHTML = "<h1>"+user_name+"</h1><h2>"+time+"</h2><p>"+element.value+"</p>";
    //window.scrollTo(0, document.body.scrollHeight); // Scroll the screen to the bottom so the new message can be seen.
}