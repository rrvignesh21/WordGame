import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class JDBCConnection {

    private static Connection connection = null;

    static{
        try{
            Class.forName("org.postgresql.Driver");
            connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/wordgame", "postgres", "Raja@2001");
        }
        catch(ClassNotFoundException | SQLException e){
                new RuntimeException(e);
        }
    }

    public static Connection getConnection(){
        return connection;
    }
}
