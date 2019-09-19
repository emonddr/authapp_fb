import {DefaultCrudRepository, Filter, Options} from '@loopback/repository';
import {User, UserRelations} from '../models';
import {MymemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {
  constructor(
    @inject('datasources.mymemory') dataSource: MymemoryDataSource,
  ) {
    super(User, dataSource);
  }

  async find(
    filter?: Filter<User>,
    options?: Options,
  ): Promise<(User & UserRelations)[]> {

    const value = await super.find(filter, options);
    //console.log(`user repo.find: ${JSON.stringify(value)}`);
    return value;
  }
}
