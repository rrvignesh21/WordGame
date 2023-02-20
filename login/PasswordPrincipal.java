package login;

import java.io.Serializable;
import java.security.Principal;

public class PasswordPrincipal implements Principal,Serializable {

  private String password;
  
  public PasswordPrincipal(String password) {
    this.password = password;
  }

  public String getName() {
    return password;
  }
}