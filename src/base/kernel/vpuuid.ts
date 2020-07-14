const uuidv4 = require('uuid/v4');

export class VPUIID {
    public static generate() : string{
        let uuid : string = uuidv4();

        return uuid.replace(/-/g, "").toUpperCase();
    }
}