import java.io.IOException;
import java.io.PrintWriter;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

public class Login extends HttpServlet{

    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            password = PasswordHash.hash(password);
            System.out.println(username + "-<o>|`.^.`|<o>-" + password);
            request.login(username, password);
            out.print(checkData(username, password));
        }
        catch(ServletException le){
            System.out.println("Error -> ");
            System.err.println(le);
            System.out.println(new RuntimeException(le));
            out.print(false);
        }
        catch(Exception e){
            System.out.println("Error -> ");
            System.err.println(e);
            System.out.println(new RuntimeException(e));
            System.err.println(new RuntimeException(e));
        }
    }

    public JSONObject checkData(String username,String password)throws Exception{
        Connection connection = JDBCConnection.getConnection();
        PreparedStatement statement = connection.prepareStatement("SELECT id,username,adminstatus from userdata where username = ? AND userpassword = ?;");  
        statement.setString(1, username);
        statement.setString(2, password);
        ResultSet resultSet = statement.executeQuery();
        JSONObject data = new JSONObject();
        if(resultSet.next()){
            data.put("id", resultSet.getInt("id"));
            data.put("username", resultSet.getString("username"));
            data.put("adminstatus", resultSet.getBoolean("adminstatus"));
        }
        resultSet.close();
        PreparedStatement statementPrefer = connection.prepareStatement("select theme from preference where userid = ?");
        statementPrefer.setInt(1, data.getInt("id"));
        ResultSet preference = statementPrefer.executeQuery();
        if(preference.next()){
            data.put("theme",preference.getInt(1));
        }
        else{
            data.put("theme", 1);
        }  
        preference.close();
        statement.close();
        return data;
    }
}