import jakarta.servlet.AsyncContext;
import jakarta.servlet.AsyncEvent;
import jakarta.servlet.AsyncListener;

import java.util.Map;
import java.io.IOException;
import java.util.Set;

public class SseAsyncListener implements AsyncListener {
    private final Map<String, Set<AsyncContext>> rooms;
    private final AsyncContext context;
    private final String room;
  
    public SseAsyncListener(Map<String, Set<AsyncContext>> rooms, AsyncContext context, String room) {
      this.rooms = rooms;
      this.context = context;
      this.room = room;
    }
  
    @Override
    public void onComplete(AsyncEvent event) throws IOException {
      synchronized (rooms) {
        Set<AsyncContext> roomContexts = rooms.get(room);
        if (roomContexts != null) {
          roomContexts.remove(context);
        }
      }
    }
  
    @Override
    public void onTimeout(AsyncEvent event) throws IOException {
      context.complete();
    }
  
    @Override
    public void onError(AsyncEvent event) throws IOException {
      context.complete();
    }
  
    @Override
    public void onStartAsync(AsyncEvent event) throws IOException {
    }
}

