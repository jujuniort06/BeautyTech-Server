export class Bind {
  constructor (private source : any){
  }

  public bindObj(properties : Array<string>) : any{
    let result : any = {};

    for (const element of properties){
      if (!this.source.hasOwnProperty(element)){
        continue;
      }

      result[element] = this.source[element];
    }

    return result;
  }

  public bindArray(properties : Array<string>) :Array<any> {
    let result : Array<any> = [];

    this.source.forEach((element : any) => {
        result.push(new Bind(element).bindObj(properties));
    });

    return result;
  }
}