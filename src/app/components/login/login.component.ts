import { Component, Inject, OnInit } from '@angular/core';
import myAppconfig from '../../config/my-appconfig';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin:any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppconfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppconfig.oidc.clientId,
      redirectUri: myAppconfig.oidc.redirectUri,
      authParams:{
        pkce:true,
        issuer: myAppconfig.oidc.issuer,
        scopes: myAppconfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
  }

}
