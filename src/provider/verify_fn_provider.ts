import {Provider} from "@loopback/core";
import {repository} from "@loopback/repository";
import {UserRepository} from "../repositories/user.repository";
import {VerifyFunctionWithRequest} from 'passport-facebook';
import {User, UserRelations} from "../models";
import {INVALID_USER_CREDENTIALS_MESSAGE} from '../keys';
import {Request} from '@loopback/rest';
import {Profile} from 'passport-facebook';



/*
(alias) type VerifyFunctionWithRequest = (req: express.Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => void
*/
export class VerifyFunctionProvider implements Provider<VerifyFunctionWithRequest> {
  constructor(
    @repository('users') private userRepo: UserRepository,
  ) {}

  value(): VerifyFunctionWithRequest {

    const myThis = this;
    return async function (req: Request, accessToken: string, refreshToken: string, profile: Profile, done): Promise<void> {
      const user: User = new User({id: 1, username: "dom", firstname: "dom", "lastname": "emond"});

      done(null, user, null);
      /*
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
          });
      */

    }
    // return async function (username: string, password: string, cb: Function) {

    //   let user: User & UserRelations;

    //   try {
    //     //find user with specific username
    //     const users: (User & UserRelations)[] = await myThis.userRepo.find({where: {username: username}});

    //     // if no user found with this username, throw an error.
    //     if (users.length < 1) {
    //       let error = new Error(INVALID_USER_CREDENTIALS_MESSAGE);//need generic message to look for in sequence. To assign 401.
    //       // the below don't help. http 500 always thrown
    //       //Object.assign(error, {code: INVALID_USER_NAME});
    //       //Object.assign(error, {statusCode: 401 /* Unauthorized */});
    //       throw error;
    //     }


    //     //verify given password matches the user's password
    //     user = users[0];
    //     if (user.password !== password) {
    //       let error = new Error(INVALID_USER_CREDENTIALS_MESSAGE);//need generic message to look for in sequence. To assign 401.
    //       // the below don't help. http 500 always thrown
    //       //Object.assign(error, {code: INVALID_USER_PASSWORD});
    //       //Object.assign(error, {statusCode: 401 /* Unauthorized */});
    //       throw error;
    //     }

    //     // user exists and password matches, so credentials are valid
    //     console.log(`In VerifyFunctionProvider.value() and found username is :${JSON.stringify(user)}`);

    //     //return null for error, and the valid user
    //     cb(null, user);
    //   } catch (error) {
    //     //return the error, and null for the user
    //     cb(error, null);
    //   }
    // }

  }


}
