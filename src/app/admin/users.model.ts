import { Deserializable } from "../Deserializable.model";

export class Users implements Deserializable {
    email?: string;
    userType?: string;
    assignedTests?: [];
    submittedTests?: [];
    finalGrade?: [];
    alreadyAssigned?: [];
    assignedType3?: [];
    mission?: string;
    level?: string;
    time?: [];

    deserialize(input: any): this {
        return Object.assign(this, input)
    }
  }
  