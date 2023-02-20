import java.io.IOException;
import java.io.PrintWriter;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.json.JSONObject;

import jakarta.servlet.http.*;

public class GetProfileData extends HttpServlet{
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statementScore = connection.prepareStatement("select score from scoreboard where userid = ?");
            statementScore.setInt(1,Integer.parseInt(request.getParameter("id")));  
            JSONObject data = new JSONObject();
            ResultSet score = statementScore.executeQuery();
            if(score.next()){
                data.put("score", score.getInt(1));
            }
            score.close();
            PreparedStatement statementRank = connection.prepareStatement("select row_number from(select userid,score,ROW_NUMBER()OVER(ORDER by score DESC) from scoreboard) as foo where userid = ?");
            statementRank.setInt(1,Integer.parseInt(request.getParameter("id")));  
            ResultSet rank = statementRank.executeQuery();
            if(rank.next()){
                data.put("rank", rank.getInt(1));
            }
            rank.close();
            statementRank.close();
            out.print(data);
        }
        catch(Exception e){
            out.print(false);
        }
    }
}