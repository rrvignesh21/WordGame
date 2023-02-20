import java.io.PrintWriter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class MakeAdmin extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement("update userdata set adminstatus = 't' where id = ?");
            PreparedStatement statement2 = connection.prepareStatement("insert into userroles values(?,?)");
            statement.setInt(1, Integer.parseInt(request.getParameter("id")));  
            statement2.setString(1,request.getParameter("username"));
            statement2.setString(2,"admin");
            if(statement.executeUpdate() != 0){
                statement2.execute();
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

