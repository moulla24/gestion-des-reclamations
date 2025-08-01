package com.bamis.reclamations.security;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthenticationRequest {
    private String email;
    private String motDePasse;
     
    public AuthenticationRequest() {}

    public AuthenticationRequest(String email, String motDePasse) {
        this.email = email;
        this.motDePasse = motDePasse;
    }

}
