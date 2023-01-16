export interface Config {
  basePath: string;
  baseOptions: any;
}
export class Configuration {
  public config: Config;

  constructor(config: Config) {
    this.config = config;
  }
}
