import java.io.PrintWriter;

import java.io.IOException;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class Registration extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            String password = request.getParameter("password");
            String username =  request.getParameter("username");  
            password = PasswordHash.hash(password);
            PreparedStatement statement = connection.prepareStatement("INSERT into userdata (username,userpassword,adminstatus) values(?,?,'f')");
            PreparedStatement statement2 = connection.prepareStatement("insert into userroles values(?,?)");
            statement.setString(1, username);
            statement.setString(2, password);
            statement2.setString(1,username);
            statement2.setString(2,"player");
            if(statement.executeUpdate() != 0){
                statement2.execute();
                connection.createStatement().execute("INSERT into scoreboard(score) VALUES(0)");
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
