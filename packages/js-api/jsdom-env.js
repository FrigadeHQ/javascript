import { TestEnvironment } from "jest-environment-jsdom";

export default class FixJSDOMEnvironment extends TestEnvironment {
  constructor(...args) {
    super(...args);
    this.global.fetch = fetch;
    this.global.Request = Request;
    this.global.Response = Response;
  }
}
