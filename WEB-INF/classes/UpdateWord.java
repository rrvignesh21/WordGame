import java.io.PrintWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class UpdateWord extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            String word = request.getParameter("word");
            int roomid = Integer.parseInt(request.getParameter("roomid"));
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statementUpdate = connection.prepareStatement("update roomdata set word = ? where roomid = ?");
            statementUpdate.setString(1, word);
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