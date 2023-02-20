import java.io.PrintWriter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class UpdateSroreRoom extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            int userid = Integer.parseInt(request.getParameter("userid"));
            int roomid = Integer.parseInt(request.getParameter("roomid"));
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statementUpdate = connection.prepareStatement("update roomscoredata set score = score + 1 where playerid = ? AND roomid = ?");
            statementUpdate.setInt(1, userid);
            statementUpdate.setInt(2, roomid);
            if(statementUpdate.executeUpdate() != 0){
                out.print(true);
            }
            else{
                out.print(false);
            }     
            statementUpdate.close();
        }
        catch(Exception e){
            out.print(e);
        }
    }
}
