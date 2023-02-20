import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import jakarta.websocket.*;
import jakarta.websocket.RemoteEndpoint.Async;

public class Socket extends Endpoint {

    private static Map<String,ArrayList<Socket>> roomdata = new HashMap<>();

    Async remote;

    public void onOpen(Session session, EndpointConfig endpoint){
        try{
            remote = session.getAsyncRemote();
            Socket currSocket = this;
            session.addMessageHandler(String.class, new MessageHandler.Whole<String>(){
                public void onMessage(String text) {
                    String[] message = text.split(":");
                    if(message[0].compareTo("roomname") == 0){
                        if(roomdata.containsKey(message[1])){
                            roomdata.get(message[1]).add(currSocket);
                        }
                        else{
                            roomdata.put(message[1], new ArrayList<Socket>());
                            roomdata.get(message[1]).add(currSocket);
                        }
                    }
                    try {
                        String[] sendingmessage = text.split("-");

                        for(int i = 0;i<roomdata.get(sendingmessage[0]).size();i++){
                            roomdata.get(sendingmessage[0]).get(i).remote.sendText(sendingmessage[1]);
                        }
                    }
                    catch (Exception e) {

                    }
                }
            });
        }
        catch(Exception e){

        }
    }
}