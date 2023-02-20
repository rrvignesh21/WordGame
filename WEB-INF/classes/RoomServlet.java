import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class RoomServlet extends HttpServlet {

  private static Set<PrintWriter> writers = new HashSet<>();
  
  protected void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
    String room = request.getParameter("room");
    ServerSocket serverSocket = new ServerSocket(8080);

    // Socket clientSocket = serverSocket.accept();
    // PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
    // BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
    while (true) {
        Socket socket = serverSocket.accept();
        System.out.println("Accepted connection from: " + socket.getInetAddress());

        PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
        writers.add(writer);
        new Thread(new SocketHandler(socket)).start();
      }
  }

  private static class SocketHandler implements Runnable {
    private Socket socket;

    public SocketHandler(Socket socket) {
      this.socket = socket;
    }

    @Override
    public void run() {
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
        while (true) {
          String line = reader.readLine();
          if (line == null) {
            break;
          }

          for (PrintWriter writer : writers) {
            writer.println("From client: " + line);
          }
        }
      } catch (IOException e) {

    }
      finally {
        writers.remove(socket);
        try {
          socket.close();
        }
        catch (IOException e) {
          //\
        }
      }
    }
  }
}
