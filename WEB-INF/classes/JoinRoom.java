import java.io.PrintWriter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class JoinRoom extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException{
        PrintWriter out = response.getWriter();
        try{
            int userid = Integer.parseInt(request.getParameter("userid"));
            int roomid = Integer.parseInt(request.getParameter("roomid"));
            Connection connection = JDBCConnection.getConnection();
            PreparedStatement statementInsert = connection.prepareStatement("insert into roomscoredata values(?,?,?)");
            PreparedStatement statement = connection.prepareStatement("update roomdata set noofplayers = noofplayers + 1 where roomid = ?");
            statementInsert.setInt(2,userid);
            statementInsert.setInt(1, roomid);
            statement.setInt(1, roomid);
            statementInsert.setInt(3, 0);
            if(checkUser(userid,roomid) < 0){
                if(statementInsert.executeUpdate() != 0){
                    statement.execute();
                    out.print(true);
                }
                else{
                    out.print(false);
                }
            }
            else{
                    out.print(false);
            }       
            statementInsert.close();
        }
        catch(Exception e){
            out.print(e);
        }
    }

    public int checkUser(int userid,int roomid)throws Exception{
        Connection connection = JDBCConnection.getConnection();
        PreparedStatement statement = connection.prepareStatement("SELECT playerid from roomscoredata where playerid = ? and roomid = ?");
        statement.setInt(1,userid);
        statement.setInt(2,roomid);
        ResultSet resultSet = statement.executeQuery();
        if(resultSet.next()){
            return resultSet.getInt(1);
        }
        else{
            return -1;
        }
    }
}
