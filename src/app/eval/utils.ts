import { KernelUtils } from "../../base/kernel/kernel-utils";

export class Utils {
    public isNullOrUndefined(obj : any) : boolean{
        return KernelUtils.isNullOrUndefined(obj);
    }

    public isArray(obj : any) : boolean{
        return KernelUtils.isArray(obj);
    }

    public isEmptyArray(obj : any) : boolean{
        return KernelUtils.isEmptyArray(obj);
    }
}