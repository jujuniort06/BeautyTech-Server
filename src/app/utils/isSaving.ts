export class IsSaving {
    private saving : boolean = false;

    private static INSTANCE : IsSaving = new IsSaving();

    public static getInstance() : IsSaving{
        return IsSaving.INSTANCE;
    }

    public isSaving() : boolean{
        return this.saving;
    }

    public start() : void{
        this.saving = true;
    }

    public stop() : void {
        this.saving = false;
    }
}