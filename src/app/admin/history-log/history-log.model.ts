import { Deserializable } from "src/app/models/Desrializable.model";

export class HistoryLog{
    historyInitiator?: string;
    timestamp?: string;
    historyContent?: string;
    userId?: string;
    // deserialize(input: any): this {
    //   return Object.assign(this, input)
    // }
  }