import java.io.PrintWriter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class DeleteRoom extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement("delete from roomdata where roomid = ?");
            statement.setInt(1, Integer.parseInt(request.getParameter("roomid")));
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
