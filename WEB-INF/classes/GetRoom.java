import java.io.PrintWriter;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import org.json.*;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class GetRoom extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response)throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            int roomid = Integer.parseInt(request.getParameter("roomid"));
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement("select * from roomdata where roomid = ?");
            statement.setInt(1,roomid);
            ResultSet roomData = statement.executeQuery();
            JSONObject room = new JSONObject();
            if(roomData.next()){
                room.put("userid", roomData.getInt("userid"));
                room.put("roomid", roomData.getInt("roomid"));
                room.put("chances",roomData.getInt("chances"));
                room.put("wordlist", roomData.getString("word"));
                room.put("roomname", roomData.getString("roomname"));
                room.put("noofplayers", roomData.getInt("noofplayers"));
            }
            out.print(room.toString());
            statement.close();
        }
        catch(SQLException e){
            out.print(new RuntimeException(e));
        }
        catch(Exception e){
            out.print(e);
        }
    }
}
