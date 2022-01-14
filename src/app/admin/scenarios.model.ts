export interface Scenarios {
  id: string;
  mission: string;
  level: string;
  title: string;
  description: string;
  type: string;
  time: number;
  scoreCard: object;
  passingGrade: number;
  userId: string;
//   passingGrade: number;
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true
  //   }
}

export interface ScenariosBackup {
  _id: string;
  mission: string;
  level: string;
  title: string;
  description: string;
  type: string;
  time: number;
  scoreCard: object;
  passingGrade: number;
  userId: string;
//   passingGrade: number;
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true
  //   }
}