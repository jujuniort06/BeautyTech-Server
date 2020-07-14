import { VPEvalResult } from "./vpevalresult";
import { VPEvalBaseLib } from "./vpevalbaselib";
import { StrUtils } from "./strUtils";
import { Utils } from "./utils";
const {VM} = require('vm2');

export class VPEval{

    constructor(private fkEquipamento : string){}

    public evaluate(script : string, lambda : (response : VPEvalResult) => void){
        try{
            const sandbox = {
                lib      : new VPEvalBaseLib(this.fkEquipamento),
                result   : new VPEvalResult(),
                strUtils : new StrUtils(),
                utils    : new Utils()
            };

            const vm = new VM({
                console : "inherit",
                sandbox : sandbox,
                eval    : false,
                wasm    : false,
                timeout : 1000 * 60
            });
        
            let code = " (async () => {             "+
                         script                      +
                       " })();                      ";

            vm.run(code).then((response : any) => {
                lambda(sandbox.result);
            }).catch(
                (error : any) => {
                    console.error(error);
                    let result = new VPEvalResult();
                    result.sucess = false;
                    result.error  = error;
                    lambda(result);
            });
        }catch(e){
            let result = new VPEvalResult();
            result.sucess = false;
            result.error  = e    ;
            lambda(result);
        }
    }
}