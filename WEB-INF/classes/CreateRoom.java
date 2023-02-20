import java.io.PrintWriter;
import java.io.IOException;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class CreateRoom extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            int userid = Integer.parseInt(request.getParameter("userid"));
            String roomname =  request.getParameter("roomname");
            String word =  request.getParameter("word");
            int chances = Integer.parseInt(request.getParameter("chances"));
            PreparedStatement statement = connection.prepareStatement("INSERT into roomdata (userid,roomname,word,chances,noofplayers) values(?,?,?,?,?)");
            statement.setInt(1, userid);
            statement.setString(2, roomname);
            statement.setString(3,word);
            statement.setInt(4, chances);
            statement.setInt(5, 0);
            if(statement.executeUpdate() != 0){
                out.print(true);
            }
            else{
                out.print(false);
            }
            statement.close();
        }
        catch(Exception e){
            out.print(e);
        }
    }
}
