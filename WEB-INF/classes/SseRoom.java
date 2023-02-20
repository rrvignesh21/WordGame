import java.io.IOException;
import java.io.PrintWriter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SseRoom extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

      response.setContentType("text/event-stream");

      response.setCharacterEncoding("UTF-8");
      int upVote = 0;
      int downVote = 0;

      PrintWriter writer = response.getWriter();

      for (int i = 0; i < 10; i++) {
        upVote = upVote + (int)(Math.random() * 10);
        downVote = downVote + (int)(Math.random() * 10);

        writer.write("event:up_vote\n");
        writer.write("data: " + upVote + "\n\n");

        writer.write("event:down_vote\n");
        writer.write("data: " + downVote + "\n\n");

          try {
              Thread.sleep(5);
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
      }
      writer.close();
    }
}
