package com.example.webchatserver;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@ServerEndpoint(value="/ws/{roomID}")
public class ChatServer {

    private final Map<String, String> usernames = new HashMap<String, String>();
    private static final Map<String, String> roomList = new HashMap<String, String>();

    /**
     * Called when a client opens a new connection to the server.
     *
     * @param roomID The ID of the room the client is joining.
     * @param session The session of the client that opened the connection.
     * @throws IOException
     */
    @OnOpen
    public void open(@PathParam("roomID") String roomID, Session session) throws IOException {
        // Send a welcome message to the client and add their session ID to the room's list of clients
        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): Welcome to the chat room. Please state your username to begin.\"}");
        roomList.put(session.getId(), roomID);
    }

    /**
     * Called when a client closes their connection to the server.
     *
     * @param session The session of the client that closed their connection.
     * @throws IOException
     */
    @OnClose
    public void close(Session session) throws IOException {
        String userId = session.getId();
        String roomID = roomList.get(userId);

        // If the user had previously sent a message, broadcast to all clients in the same room that they have left.
        if (usernames.containsKey(userId)) {
            String username = usernames.get(userId);
            usernames.remove(userId);
            for (Session peer : session.getOpenSessions()){ //broadcast this person left the server.
                if (roomList.get(peer.getId()).equals(roomID)) {
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + username + " left the chat room.\"}");
                }
            }
        }
    }

    /**
     * Handles incoming messages from clients.
     *
     * @param comm The json message received from the client.
     * @param session The session of the client that sent the message.
     * @throws IOException
     */
    @OnMessage
    public void handleMessage(String comm, Session session) throws IOException {
        String userID = session.getId();
        String roomID = roomList.get(userID);

        // Convert the incoming message into a JSONObject and extract its type and message fields.
        JSONObject json_msg = new JSONObject(comm);
        String type = (String) json_msg.get("type");
        String message = (String) json_msg.get("msg");

        if(usernames.containsKey(userID)){
            // If this is not the user's first message, broadcast the message to all clients in the same room.
            String username = usernames.get(userID);
            System.out.println(username);
            for(Session peer: session.getOpenSessions()){
                if (roomList.get(peer.getId()).equals(roomID)) {
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(" + username + "): " + message+"\"}");
                }
            }
        }else{
            // If this is the user's first message, store their username and welcome them to the chat room.
            usernames.put(userID, message);
            session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): Welcome, " + message + "!\"}");

            // Broadcast to all clients in the same room that the user has joined.
            for(Session peer: session.getOpenSessions()){
                if((!peer.getId().equals(userID)) && (roomList.get(peer.getId())).equals(roomID)){
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + message + " joined the chat room.\"}");
                }
            }
        }
    }

}