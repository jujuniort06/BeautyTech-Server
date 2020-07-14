export class VPStringUtils {
    public static nonNullString(value : string){
        if (value == undefined || value == null){
            return "";
        }

        return value;
    }

    public static trim(value : string) : string{
        return VPStringUtils.nonNullString(value).trim();
    }

    public static isEmpty(value : string) : boolean{
        return VPStringUtils.trim(value).length == 0;
    }

    public static isNotEmpty(value : string) : boolean{
        return !VPStringUtils.isEmpty(value);
    }

    public static equals(value1 : string, value2 : string) : boolean{
        return VPStringUtils.nonNullString(value1) == VPStringUtils.nonNullString(value2);
    }
}