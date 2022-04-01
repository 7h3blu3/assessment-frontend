import { Deserializable } from "../models/Desrializable.model";

export class Scenarios implements Deserializable {
  id: string;
  mission: string;
  level: string;
  title: string;
  description?: string;
  type: string;
  time: number;
  passingGrade: number;
  userId: string;
  logsUrl: string
  scoreCard: {
    question?: string,
    weight?:number,
    question2?: string,
    weight2?:number,
    question3?: string,
    weight3?:number,
    question4?: string,
    weight4?:number,
    question5?: string,
    weight5?:number,
  };
  grandTotal: number;
  deserialize(input: any): this {
      return Object.assign(this, input)
  }
}

export interface ScenariosBackup {
  _id: string;
  mission: string;
  level: string;
  title: string;
  description: string;
  type: string;
  time: number;
  passingGrade: number;
  userId: string;
  logsUrl: string
  scoreCard: {
    question: string,
  weight:number,
  question2: string,
  weight2:number,
  question3: string,
  weight3:number,
  question4: string,
  weight4:number,
  question5: string,
  weight5:number,
  }
//   passingGrade: number;
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true
  //   }
}
