import { Deserializable } from "../models/Desrializable.model";

export class Users implements Deserializable{
  id?: string;
  email?: string;
  userType?: string;
  assignedScenarios?: [];
  submittedScenarios?: [];
  finalGrade?: [
  ];
  alreadyAssigned?: [];
  assignedType3?: [];
  mission?: string;
  level?: string;
  time?: [];

  deserialize(input: any): this {
    return Object.assign(this, input)
  }
}

export class UserId {
    id:string;
}

export class AssignedScenarios{
  assignedScenarios: any;
}