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

public class Search extends HttpServlet{

    protected void doPost(HttpServletRequest request,HttpServletResponse response)throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            String searchData = request.getParameter("searchdata");
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statement0 = connection.prepareStatement("select id,row_number,username,score,adminstatus "
            + "from (select userid,score,ROW_NUMBER()OVER(ORDER by score DESC) from scoreboard) "
            +"as foo inner join userdata on userid = id  where username LIKE ? OR "
            +"Cast(score as TEXT) "
            +"LIKE ? OR "
            +" Cast(row_number as TEXT)"
            +" LIKE ?");
            PreparedStatement statement1 = connection.prepareStatement("select id,row_number,username,score,adminstatus "
            + "from (select userid,score,ROW_NUMBER()OVER(ORDER by score DESC) from scoreboard) "
            +"as foo inner join userdata on userid = id  where username LIKE ? OR"
            +" Cast(score as TEXT)"
            +"LIKE ? OR"
            +" Cast(row_number as TEXT)"
            +"LIKE ?");
            int mode = Integer.parseInt(request.getParameter("search"));
            ResultSet scoreData;
            if(mode == 0){
                statement0.setString(1,"%" + searchData + "%");
                statement0.setString(2, "%" + searchData + "%");
                statement0.setString(3, "%" + searchData + "%");
                scoreData = statement0.executeQuery();
            }
            else{
                statement1.setString(1, searchData);
                statement1.setString(2, searchData);
                statement1.setString(3, searchData);
                scoreData = statement1.executeQuery();
            }
            JSONArray data = new JSONArray();
            while(scoreData.next()){
                JSONObject score = new JSONObject();
                score.put("rank",scoreData.getInt("row_number"));
                score.put("id", scoreData.getInt("id"));
                score.put("username", scoreData.getString("username"));
                score.put("score",scoreData.getInt("score"));
                score.put("adminstatus",scoreData.getBoolean("adminstatus"));
                data.put(score);
            }
            out.print(data.toString());
            statement0.close();
            statement1.close();
        }
        catch(SQLException e){
            out.print(new RuntimeException(e));
        }
        catch(Exception e){
            out.print(e);
        }
    }
}
