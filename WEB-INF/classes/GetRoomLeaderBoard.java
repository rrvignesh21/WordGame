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

public class GetRoomLeaderBoard extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response)throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            int roomid = Integer.parseInt(request.getParameter("roomid"));
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement(
            "select ROW_NUMBER()OVER(ORDER by score DESC),roomdata.roomid,"
            +"username,playerid,score from roomscoredata inner join roomdata" 
            +" on roomscoredata.roomid = roomdata.roomid inner join userdata on"
            +" id = playerid where roomdata.roomid = ? order by score desc");
            statement.setInt(1,roomid);
            ResultSet scoreData = statement.executeQuery();
            JSONArray data = new JSONArray();
            while(scoreData.next()){
                JSONObject score = new JSONObject();
                score.put("rank", scoreData.getInt("row_number"));
                score.put("id", scoreData.getInt("playerid"));
                score.put("username", scoreData.getString("username"));
                score.put("score",scoreData.getInt("score"));
                score.put("roomid",scoreData.getInt("roomid"));
                data.put(score);
            }
            out.print(data.toString());
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
