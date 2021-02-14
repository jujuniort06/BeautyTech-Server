import { v4 as uuidv4 } from 'uuid';

export class UIID {
  public static generate() : string{
    let uiid : string = uuidv4();

    return uiid.replace(/-/g, "").toUpperCase();
  }
}