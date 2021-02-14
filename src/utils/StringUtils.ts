export enum TodayDateTypes {
  'YY/MM/DD',
  'YY/MM/DD/HH/MM',
  'YY/MM/DD/HH/MM/SS',
  'DD/MM/YY',
  'DD/MM/YY/HH/MM',
  'DD/MM/YY/HH/MM/SS',
}

export class StringUtils {
    public static nonNullString(value : string, defaultValue = ''){
        if (value == undefined || value == null){
            return defaultValue;
        }

        return value;
    }

    public static trim(value : string) : string{
        return StringUtils.nonNullString(value).trim();
    }

    public static isEmpty(value : string) : boolean{
        return StringUtils.trim(value).length == 0;
    }

    public static isNotEmpty(value : string) : boolean{
        return !StringUtils.isEmpty(value);
    }

    public static equals(value1 : string, value2 : string, caseSensitive : boolean = true) : boolean{
        if (caseSensitive){            
            return StringUtils.nonNullString(value1) == StringUtils.nonNullString(value2);
        }

        return StringUtils.nonNullString(value1).toUpperCase() == StringUtils.nonNullString(value2).toUpperCase();
    }

    public static prepareXMLToJSON(AXML : string) : string{        
        AXML = AXML.replace(/&/g , '&amp;', );
        AXML = AXML.replace(/"/g , '&quot;');
        AXML = AXML.replace(/""/g, '&#39;' );
        AXML = AXML.replace(/</g , '&lt;'  );
        AXML = AXML.replace(/>/g , '&gt;'  );
        AXML = AXML.replace(/\//g, '&#x2F;');

        return AXML;
    }

    public static pestoreXMLFromJSON(AJSONXml){
        AJSONXml = AJSONXml.replace('&amp;', '&');
        AJSONXml = AJSONXml.replace('&quot;', '"');
        AJSONXml = AJSONXml.replace('&#39;', '""');
        AJSONXml = AJSONXml.replace('&lt;', '<');
        AJSONXml = AJSONXml.replace('&gt;', '>');
        AJSONXml = AJSONXml.replace('&#x2F;', '/');
    }

    public static startWithNumber(value : string) : boolean {
        if (StringUtils.nonNullString(value).match(/^\d/)){
            return true;
        }

        return false;
    }

    public static removerDots(value : string){
        return value.replace(/\./g, '');
    }

    public static isNumeric(value : any){
        return !isNaN(value);
    }

    public static hasWhiteSpace(value) {
      return value.indexOf(' ') >= 0;
    }

    public static getTodayDate(vpTodayDateTypes : TodayDateTypes, delimiter : string = '-'){
      if (vpTodayDateTypes == TodayDateTypes["YY/MM/DD"]){
        return new Date().getFullYear().toString() + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + ("0" + new Date().getDate()).slice(-2);
      }
      
      if (vpTodayDateTypes == TodayDateTypes["YY/MM/DD/HH/MM"]){
        return new Date().getFullYear().toString() + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + ("0" + new Date().getDate()).slice(-2) + ' - ' + new Date().getHours() + ':' + new Date().getMinutes();
      }

      if (vpTodayDateTypes == TodayDateTypes["YY/MM/DD/HH/MM/SS"]){
        return new Date().getFullYear().toString() + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + ("0" + new Date().getDate()).slice(-2) + ' - ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
      }

      if (vpTodayDateTypes == TodayDateTypes["DD/MM/YY"]){
        return ("0" + new Date().getDate()).slice(-2) + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + new Date().getFullYear().toString();
      }

      if (vpTodayDateTypes == TodayDateTypes["DD/MM/YY/HH/MM"]){
        return ("0" + new Date().getDate()).slice(-2) + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + new Date().getFullYear().toString() + ' - ' + new Date().getHours() + ':' + new Date().getMinutes();
      }

      if (vpTodayDateTypes == TodayDateTypes["DD/MM/YY/HH/MM/SS"]){
        return ("0" + new Date().getDate()).slice(-2) + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + new Date().getFullYear().toString() + ' - ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
      }
    }
}