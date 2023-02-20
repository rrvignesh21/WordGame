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

public class GetScoreBoard extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response)throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement("select id,username,score,adminstatus from scoreboard inner join userdata on userid = id order by score DESC");
            ResultSet scoreData = statement.executeQuery();
            JSONArray data = new JSONArray();
            int rank = 1;
            while(scoreData.next()){
                JSONObject score = new JSONObject();
                score.put("rank", rank);
                score.put("id", scoreData.getInt("id"));
                score.put("username", scoreData.getString("username"));
                score.put("score",scoreData.getInt("score"));
                score.put("adminstatus",scoreData.getBoolean("adminstatus"));
                data.put(score);
                rank = rank + 1;
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
