import { KernelUtils } from "../../base/kernel/kernel-utils"

export class VpDate {
  private internalMakeTimeFromString(date : Date, time : string){
    new KernelUtils().createExceptionApiError('9999', 'Hora informada inválida', time == undefined || time == null || time.length < 12);
    
    let array = time.split(":");

    new KernelUtils().createExceptionApiError('9999', 'Hora informada inválida, formato válido hh:mm:ss:zzz', array.length < 4);
    
    date.setHours(Number(array[0]), Number(array[1]), Number(array[2]), Number(array[3]));        
  }

  public makeTimeFromString(time : string) : Date{    
    let date = new Date();
    this.internalMakeTimeFromString(date, time);
    return date;
  }

  public makeDateFromString(date : string) : Date{
    new KernelUtils().createExceptionApiError('9999', 'Data informada inválida', date == undefined || date == null || date.length < 10);
    
    let array = date.split(".");

    new KernelUtils().createExceptionApiError('9999', 'Hora informada inválida, formato válido dd.mm.yyyy', array.length < 3);

    const result = new Date(Number(array[2]), Number(array[1]) - 1, Number(array[0]));
    
    return result;
  }

  public makeDateTimeFromString(data : string, hora : string) : Date{
     let date = this.makeDateFromString(data);

     this.internalMakeTimeFromString(date, hora);

    return date;
  }
}