import java.io.PrintWriter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.ResultSet;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class SetPreference extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            int id = Integer.parseInt(request.getParameter("id"));
            int theme = Integer.parseInt(request.getParameter("theme"));
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statementInsert = connection.prepareStatement("insert into preference values(?,?)");
            PreparedStatement statementUpdate = connection.prepareStatement("update preference set theme = ? where userid = ?");
            statementInsert.setInt(1,id);
            statementInsert.setInt(2, theme);
            statementUpdate.setInt(1, theme);
            statementUpdate.setInt(2, id);
            if(checkUser(id) < 0){
                if(statementInsert.executeUpdate() != 0){
                    out.print(true);
                }
                else{
                    out.print(false);
                }
            }
            else{
                if(statementUpdate.executeUpdate() != 0){
                    out.print(true);
                }
                else{
                    out.print(false);
                }
            }       
            statementInsert.close();
            statementUpdate.close();
        }
        catch(Exception e){
            out.print(e);
        }
    }

    public int checkUser(int id)throws Exception{
        Connection connection = JDBCConnection.getConnection();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery("SELECT userid from preference where userid = "+ id);
        if(resultSet.next()){
            return resultSet.getInt(1);
        }
        else{
            return -1;
        }
    }
}