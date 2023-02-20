package login;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.Map;

import javax.security.auth.Subject;
import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.NameCallback;
import javax.security.auth.callback.PasswordCallback;
import javax.security.auth.login.LoginException;
import javax.security.auth.spi.LoginModule;

public class LoginAuth implements LoginModule {

    private Subject subject;
    private CallbackHandler callbackHandler;
    private Map options;
    private Map sharedState;

    private boolean succeeded = false;
    private boolean commitSucceeded = false;

    private UserPrincipal userPrincipal;
    private RolePrincipal rolePrincipal;
    private PasswordPrincipal passwordPrincipal;

    private String username = null;
    private char[] password = null;

    public void initialize(Subject subject, CallbackHandler callbackHandler, Map<String, ?> sharedState,
    Map<String, ?> options) {
        System.out.println(options);
        this.subject = subject;
        this.callbackHandler = callbackHandler;
        this.options = options;
        this.sharedState = sharedState;
    }

    public boolean login() throws LoginException {
        if (callbackHandler == null){
            throw new LoginException("Error: no CallbackHandler available ");
        }
        Callback[] callbacks = new Callback[2];
        callbacks[0] = new NameCallback("username");
        callbacks[1] = new PasswordCallback("password: ", false);
        try {
            callbackHandler.handle(callbacks);
            username = ((NameCallback)callbacks[0]).getName();
            password = ((PasswordCallback)callbacks[1]).getPassword();
            System.out.println( "Login Auth login fn " + username + "- -" + password.toString());
            if (username == null || password == null) {
                throw new LoginException("Callback handler does not return login data properly"); 
            }
            if (isValidUser()) {
                System.out.println("Logged In");
                succeeded = true;
                return true;
            }
            throw new LoginException("Authentication failed");
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean commit() throws LoginException {
        System.out.println("Commit 1-");
        if(succeeded){
        System.out.println("Commit 1-S");
        userPrincipal = new UserPrincipal(username);
        passwordPrincipal = new PasswordPrincipal(new String(password));
        rolePrincipal = new RolePrincipal("player");
            subject.getPrincipals().add(userPrincipal);
            // subject.getPrincipals().add(passwordPrincipal);
            subject.getPrincipals().add(rolePrincipal);
            commitSucceeded = true;
            return true;
        }
        else{
        System.out.println("Commit 1-F");
            commitSucceeded = false;
            return false;
        }
    }
    
    public boolean abort() throws LoginException {
        return false;
    }

    public boolean logout() throws LoginException {
        System.out.println("Logout - jaas");
        subject.getPrincipals().remove(userPrincipal);
        subject.getPrincipals().remove(passwordPrincipal);
        subject.getPrincipals().remove(rolePrincipal);
        succeeded = false;
        commitSucceeded = false;
        return true;
    }
    
    private boolean isValidUser(){
        String sql = (String)options.get("userQuery");
        Connection connection = null;
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            connection = getConnection();
            statement = connection.prepareStatement(sql);
            statement.setString(1, username);
            statement.setString(2, new String(password));
            System.out.println( "Into IsValid User = " + username + "<-|-|->" + password.toString());
            resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return true;
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        finally {
            try{
            resultSet.close();
            statement.close();
            connection.close();
            }
            catch(SQLException se){
                se.printStackTrace();
            }
        }
        return false;
    }

    private Connection getConnection(){
        String dBUser = (String)options.get("dbUser");
        String dBPassword = (String)options.get("dbPassword");
        String dBUrl = (String)options.get("dbURL");
        String dBDriver = (String)options.get("dbDriver");
        Connection connection = null;
        try {
            Class.forName (dBDriver).newInstance();
            connection = DriverManager.getConnection (dBUrl, dBUser, dBPassword);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return connection;
    }
}