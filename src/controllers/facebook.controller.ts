import {Request, RestBindings, get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import {authenticate} from '@loopback/authentication';

/**
 * A simple controller to bounce back http requests
 */
export class FacebookController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @authenticate('facebook', {scope: "email"})
  @get('/auth/facebook')
  handleFacebookLogin() {
    console.log(`Inside /auth/facebook`);
  }

  @authenticate('facebook', {successRedirect: "/content", failureRedirect: "/"})
  @get('/auth/facebook/callback')
  handleFacebookAuthCallback() {
    console.log(`Inside /auth/facebook/callback`);
  }

}
