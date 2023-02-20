import java.io.PrintWriter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class RemoveUser extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statementUserData = connection.prepareStatement("delete from userdata where id = ?");
            PreparedStatement statementScore = connection.prepareStatement("delete from scoreboard where userid = ?" );
            statementUserData.setInt(1, Integer.parseInt(request.getParameter("id")));
            statementScore.setInt(1, Integer.parseInt(request.getParameter("id")));
            if(statementUserData.executeUpdate() != 0){
                statementScore.execute();
                out.print(true);
            }
            else{
                out.print(false);
            }
            statementUserData.close();
            statementScore.close();
        }
        catch(Exception e){
            out.print(e);
        }
    }
}