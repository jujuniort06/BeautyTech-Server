import {ApiError} from './route-types';

export class KernelUtils {

    public static isNullOrUndefined(param : any) : boolean{
        return param == null || param == undefined;
    }

    public static isArray(param : any) : boolean{
        if (KernelUtils.isNullOrUndefined(param)){
            return false;
        }

        return Array.isArray(param);
    }

    public static isEmptyArray(param : any) : boolean{
        if (!KernelUtils.isArray(param)){
            return false;
        }

        return param.length == 0;
    }

    public createErrorApiObject(errorHttp : number, apiError : string, errorDescription : string, adicionalInfo : string = '') : ApiError{
        let error : ApiError = {
          HttpError : errorHttp,
          ApiError : apiError,
          ErrorDescription : errorDescription,
          AditionalInfo : adicionalInfo
        };
        
        return error;
      }

    public createExceptionApiError(apiError : string, adicionalInfo : string, condition : boolean = true) : void {
        if (condition){
            throw this.createErrorApiObject(404, apiError, '', adicionalInfo);            
        }
    }   

    public createExceptionFromException(e : any) : any{              
        let error : ApiError = this.createErrorApiObject(500, '', '', '');

        if (e.HttpError){
            error.HttpError = e.HttpError;
        }

        if (e.ApiError){
            error.ApiError = e.ApiError;
        }

        if (e.ErrorDescription){
            error.ErrorDescription = e.ErrorDescription;
        }

        if (e.AditionalInfo){
            error.AditionalInfo = e.AditionalInfo;
        }

        return error;
    }
}