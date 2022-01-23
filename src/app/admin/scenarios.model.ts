export interface Scenarios {
  id: string;
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
  };
//   passingGrade: number;
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true
  //   }
}

export interface scoreCard {
  question: string,
  weight:number,
  question2: string,
  weight2:number,
  question3?: string,
  weight3?:number,
  question4?: string,
  weight4?:number,
  question5?: string,
  weight5?:number,
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