import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './mymemory.datasource.json';

export class MymemoryDataSource extends juggler.DataSource {
  static dataSourceName = 'mymemory';

  constructor(
    @inject('datasources.config.mymemory', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
