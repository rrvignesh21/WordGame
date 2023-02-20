import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class WordDefinition {
    private static final String apiKey="da5a473c9914e8bda1a1cb7540106891";
    private static final String appid = "5462d261";
    
    public static String getWordDefinitionJsonString(String word) throws RuntimeException{  
        String Url = "";
        if(word!=null && word!="")
            Url = "https://od-api.oxforddictionaries.com/api/v2/words/en-gb?q="+ word +"&fields=definitions";

        StringBuilder strBuf = new StringBuilder();  

        HttpURLConnection conn=null;
        BufferedReader reader=null;
        try{
            URL url = new URL(Url);  
            conn = (HttpURLConnection)url.openConnection();  
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("app_key",apiKey);
            conn.setRequestProperty("app_id",appid);
            
            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("HTTP GET Request Failed with Error code : "
                + conn.getResponseCode());
            }
	        reader = new BufferedReader(new InputStreamReader(conn.getInputStream(),"utf-8"));
            String output = null;
            while ((output = reader.readLine()) != null)  
                strBuf.append(output);  
        }
        catch(MalformedURLException e) {  
            e.printStackTrace();   
        }
        catch(IOException e){  
            e.printStackTrace();   
        }
        finally
        {
            if(reader!=null)
            {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(conn!=null)
            {
                conn.disconnect();
            }
        }
        return strBuf.toString();  
    }
}
