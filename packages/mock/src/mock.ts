import path from 'path';
import fs from 'fs';
import os from 'os';
import {DOMAIN_SERVERS} from './constants';
import VerdaccioProcess from './server_process';
import {VerdaccioConfig} from './verdaccio-server';
import Server from './server';
import {IServerBridge} from './types';

/**
 * Fork a Verdaccio process with a custom configuration.
 *
 * Usage:
 *
 *  - Fork the process within the beforeAll body.
 *  - Define a storage (use a specific name)
 *  - Define a unique port (be careful with conflicts)
 *  - Set a configuration
 *  - await / mockServer
 *  - call done();
 *
 *  beforeAll(function(done) {
      const store = path.join(__dirname, '../partials/store/test-profile-storage');
      const mockServerPort = 55544;
      rimraf(store, async () => {
        const parsedConfig = parseConfigFile(parseConfigurationProfile());
        const configForTest = _.assign({}, _.cloneDeep(parsedConfig), {
          storage: store,
          auth: {
            htpasswd: {
              file: './test-profile-storage/.htpasswd'
            }
          },
          self_path: store
        });
        app = await endPointAPI(configForTest);
        mockRegistry = await mockServer(mockServerPort).init();
        done();
    });

   On finish the test we must close the server

   afterAll(function(done) {
    mockRegistry[0].stop();
    done();
   });

 *
 *
 * @param port
 * @returns {VerdaccioProcess}
 */
export function mockServer(port: number) {
  const tempRoot = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir())));
  fs.copyFileSync(
    path.join(__dirname, '/config-unit-mock-server-test.yaml'),
    path.join(tempRoot, 'verdaccio.yaml'),
  );
  console.log("-->tempRoot", tempRoot);
  const pathStore = path.join(__dirname, './config/yaml');
  const configPath = path.join(__dirname, '/config-unit-mock-server-test.yaml');
  const storePath = path.join(pathStore, '/mock-store');

  const verdaccioConfig = new VerdaccioConfig(storePath, configPath, `http://${DOMAIN_SERVERS}:${port}/`, port);
  const server: IServerBridge = new Server(verdaccioConfig.domainPath);

  return new VerdaccioProcess(verdaccioConfig, server, false, false, false);
}
