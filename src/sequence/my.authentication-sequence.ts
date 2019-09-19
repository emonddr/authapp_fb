import {SequenceHandler, SequenceActions, FindRoute, ParseParams, InvokeMethod, Send, Reject, RequestContext} from '@loopback/rest';
import {AuthenticationBindings, AuthenticateFn, AUTHENTICATION_STRATEGY_NOT_FOUND, USER_PROFILE_NOT_FOUND} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {INVALID_USER_CREDENTIALS_MESSAGE, INVALID_USER_CREDENTIALS_CODE} from '../keys';

export class MyAuthenticationSequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);

      //call authentication action
      await this.authenticateRequest(request);

      // Authentication successful, proceed to invoke controller
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (error) {

      // intercept the invalid credentials error issued by
      // verify provider and passed to 'passport-http'
      // add a code to the error object to conform to standard below


      if (error.message.message === INVALID_USER_CREDENTIALS_MESSAGE) {
        Object.assign(error, {code: INVALID_USER_CREDENTIALS_CODE});
        //not sure why error.message is empty object. Going to assign error.message a value
        Object.assign(error, {message: INVALID_USER_CREDENTIALS_MESSAGE});
      }

      //
      // The authentication action utilizes a strategy resolver to find
      // an authentication strategy by name, and then it calls
      // strategy.authenticate(request).
      //
      // The strategy resolver throws a non-http error if it cannot
      // resolve the strategy. When the strategy resolver obtains
      // a strategy, it calls strategy.authenticate(request) which
      // is expected to return a user profile. If the user profile
      // is undefined, then it throws a non-http error.
      //
      // It is necessary to catch these errors and add HTTP-specific status
      // code property.
      //
      // Errors thrown by the strategy implementations already come
      // with statusCode set.
      //
      // In the future, we want to improve `@loopback/rest` to provide
      // an extension point allowing `@loopback/authentication` to contribute
      // mappings from error codes to HTTP status codes, so that application
      // don't have to map codes themselves.


      if (
        error.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        error.code === USER_PROFILE_NOT_FOUND ||
        error.code === INVALID_USER_CREDENTIALS_CODE
      ) {
        Object.assign(error, {statusCode: 401 /* Unauthorized */});
      }

      this.reject(context, error);
      return;
    }
  }
}
