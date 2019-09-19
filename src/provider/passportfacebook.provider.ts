import {AuthenticationStrategy, AuthenticationBindings, AuthenticationMetadata, UserProfile} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {inject} from '@loopback/context';
import {Provider, Getter} from '@loopback/core';
import {Strategy as FacebookStrategy, VerifyFunctionWithRequest, StrategyOptionWithRequest} from 'passport-facebook';
import {AUTH_STRATEGY_NAME} from '../keys';
import {RestBindings, Request} from '@loopback/rest';


export class PassportFacebookProvider implements Provider<AuthenticationStrategy> {

  constructor(
    @inject('authentication.facebook.verify') private verifyFn: VerifyFunctionWithRequest,
    @inject('facebook.connection.options') private connectionOptions: StrategyOptionWithRequest,
    @inject.getter(AuthenticationBindings.METADATA)
    readonly getMetaData: Getter<AuthenticationMetadata>,
    @inject(RestBindings.Http.REQUEST) private req: Request
  ) {};
  async value(): Promise<AuthenticationStrategy> {
    const facebookStrategy = this.configuredBasicStrategy(this.verifyFn);
    return await this.convertToAuthStrategy(facebookStrategy);
  }

  // Takes in the verify callback function and returns a configured basic strategy.
  configuredBasicStrategy(verifyFn: VerifyFunctionWithRequest): FacebookStrategy {

    return new FacebookStrategy(this.connectionOptions, verifyFn);
  }

  // Applies the `StrategyAdapter` to the configured basic strategy instance.
  // You'd better define your strategy name as a constant, like
  // `const AUTH_STRATEGY_NAME = 'facebook'`
  // You will need to decorate the APIs later with the same name
  async convertToAuthStrategy(facebook: FacebookStrategy): Promise<AuthenticationStrategy> {


    /**
       Obtain the options object specified in the @authenticate decorator
       of a controller method associated with the current request.
       The AuthenticationMetadata interface contains : strategy:string, options?:object
       We want the options property.
   */

    const controllerMethodAuthenticationMetadata = await this.getMetaData();


    console.log(`current options for request url: ${this.req.url}: ${JSON.stringify(controllerMethodAuthenticationMetadata.options)}`);

    // we're going to need to pass in options for this request..perhaps a new optional parameter
    // see https://github.com/strongloop/loopback-next/blob/labs/passport-adapter/labs/authentication-passport/src/strategy-adapter.ts#L61

    return new StrategyAdapter(facebook, AUTH_STRATEGY_NAME);

    /*

    Current problem I am encountering when trying to access: '/auth/facebook' or '/auth/facebook/callback'

    Unhandled error in GET /auth/facebook/callback: 500 InternalServerError: TypeError: self.redirect is not a function
        at Strategy.strategy.error (/Users/dremond/Documents/all_facebook_auth_examples/authapp_fb/node_modules/@loopback/authentication-passport/src/strategy-adapter.ts:57:16)
        at Strategy.OAuth2Strategy.authenticate (/Users/dremond/Documents/all_facebook_auth_examples/authapp_fb/node_modules/passport-oauth2/lib/strategy.js:285:21)
        at Strategy.authenticate (/Users/dremond/Documents/all_facebook_auth_examples/authapp_fb/node_modules/passport-facebook/lib/strategy.js:84:41)
        at Promise (/Users/dremond/Documents/all_facebook_auth_examples/authapp_fb/node_modules/@loopback/authentication-passport/src/strategy-adapter.ts:61:16)
        at new Promise (<anonymous>)
        at StrategyAdapter.authenticate (/Users/dremond/Documents/all_facebook_auth_examples/authapp_fb/node_modules/@loopback/authentication-passport/src/strategy-adapter.ts:35:12)
        at AuthenticateActionProvider.action (/Users/dremond/Documents/all_facebook_auth_examples/authapp_fb/node_modules/@loopback/authentication/src/providers/auth-action.provider.ts:52:40)
        at process._tickCallback (internal/process/next_tick.js:68:7)
    */

  }

}
