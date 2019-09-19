import {AuthApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
  AuthenticationBindings
} from '@loopback/authentication';
import {PassportFacebookProvider} from './provider/passportfacebook.provider';
import {CoreTags, addExtension} from '@loopback/core';
import {VerifyFunctionProvider} from './provider/verify_fn_provider';
import {MyAuthenticationSequence} from './sequence/my.authentication-sequence';
import {UserRepository} from './repositories/user.repository';


export {AuthApplication};


export async function main(options: ApplicationConfig = {}) {
  const app = new AuthApplication(options);

  app.component(AuthenticationComponent);

  const facebookConnectOptions = {
    clientID: 'some client id',
    clientSecret: 'some secret',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: true,
    profileFields: ['id', 'displayName', 'email']
  };

  app.bind('facebook.connection.options').to(facebookConnectOptions);

  app.bind('repositories.users').toClass(UserRepository);

  // the verify function for passport-facebook
  app.bind('authentication.facebook.verify').toProvider(VerifyFunctionProvider);

  //registerAuthenticationStrategy(app, PassportBasicAuthProvider);
  // doesn't work ^

  // app
  //   .bind('authentication.strategies.basicAuthStrategy')
  //   .to(PassportBasicAuthProvider)
  //   .tag({
  //     [CoreTags.EXTENSION_FOR]:
  //       AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
  //   });

  addExtension(
    app,
    AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
    PassportFacebookProvider,
    {
      namespace:
        AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
    },
  );

  app.sequence(MyAuthenticationSequence);

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
