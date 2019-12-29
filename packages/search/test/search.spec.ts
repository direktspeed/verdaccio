import Search from '../src/search';
import { Config } from '@verdaccio/config';
import { Storage } from '@verdaccio/store';
import { configExample } from '@verdaccio/mock';
import { setup } from '@verdaccio/logger';

setup([]);

const packages = [
  {
    name: 'test1',
    description: 'description',
    _npmUser: {
      name: 'test_user',
    },
  },
  {
    name: 'test2',
    description: 'description',
    _npmUser: {
      name: 'test_user',
    },
  },
  {
    name: 'test3',
    description: 'description',
    _npmUser: {
      name: 'test_user',
    },
  },
];

describe('search', () => {
  beforeAll(async function() {
    const config = new Config(configExample());
    const storage = new Storage(config);
    await storage.init(config);
    Search.configureStorage(storage);
    packages.map(function(item) {
      // @ts-ignore
      Search.add(item);
    });
  });

  test('search query item', () => {
    const result = Search.query('t');
    expect(result).toHaveLength(3);
  });

  test('search remove item', () => {
    const item = {
      name: 'test6',
      description: 'description',
      _npmUser: {
        name: 'test_user',
      },
    };
    // @ts-ignore
    Search.add(item);
    let result = Search.query('test6');
    expect(result).toHaveLength(1);
    Search.remove(item.name);
    result = Search.query('test6');
    expect(result).toHaveLength(0);
  });
});
