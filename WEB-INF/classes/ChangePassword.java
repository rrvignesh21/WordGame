import java.io.PrintWriter;
import java.io.IOException;

import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class ChangePassword extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement("update userdata set userpassword = crypt('?',gen_salt('bf')) where id = ?");
            String password =  request.getParameter("password");
            int id = Integer.parseInt(request.getParameter("id"));
            statement.setString(1, password);
            statement.setInt(2, id);
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