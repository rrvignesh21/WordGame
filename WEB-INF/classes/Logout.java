import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

import java.io.IOException;
import java.io.PrintWriter;

public class Logout extends HttpServlet{
    protected void doPost(HttpServletRequest request,HttpServletResponse response)throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            response.setDateHeader("Expires", 0); 
            System.out.println("Logout");
            request.getSession().invalidate();
            request.logout();
            out.print(true);
        }
        catch(Exception e){
            out.print(e);
        }
    }
}