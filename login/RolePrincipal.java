package login;

import java.io.Serializable;
import java.security.Principal;

public class RolePrincipal implements Principal,Serializable{

  private String role;
  
  public RolePrincipal(String role) {
    this.role = role;
  }
  public String getName() {
    return role;
  }
}