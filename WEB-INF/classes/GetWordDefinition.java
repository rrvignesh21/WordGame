import java.io.PrintWriter;

import java.io.IOException;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServlet;

public class GetWordDefinition extends HttpServlet{
    
    protected void doPost(HttpServletRequest request,HttpServletResponse response)throws IOException{
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try{
            String word = request.getParameter("word");
            out.print(WordDefinition.getWordDefinitionJsonString(word));
        }
        catch(Exception e){
            out.print(e);
        }
    }
}