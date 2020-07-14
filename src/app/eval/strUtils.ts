import { VPStringUtils } from "../../base/kernel/VPStringUtils";

export class StrUtils{

    private equals(value1 : string, value2 : string) : boolean{
        return VPStringUtils.equals(value1, value2);
    }

    private nonNull(value : string) : string {
        return VPStringUtils.nonNullString(value);
    }

    private isEmpty(value : string) : boolean{
        return VPStringUtils.isEmpty(value);
    }

    private trim(value : string) : string{
        return VPStringUtils.trim(value);
    }
}