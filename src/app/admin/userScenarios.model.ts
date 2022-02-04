import { Deserializable } from "../models/Desrializable.model";
import { Scenarios } from "./scenarios.model";
import { Users } from "./users.model";

export class userScenarios implements Deserializable {
  scenarios: Scenarios;
  user: Users;

  deserialize(input: any): this {
      return Object.assign(this, input)
  }
}
