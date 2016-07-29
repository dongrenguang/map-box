import JSONModel from "sap/ui/model/json/JSONModel";

export default class Model extends JSONModel
{
    constructor(...args)
    {
        super({
            selectedPoi: null,
            originPoi: null,
            destinationPoi: null
        });
    }

    forceSetProperty(sPath, oValue, oContent, bAsyncUpdate)
    {
        const result = this.setProperty(sPath, oValue, oContent, bAsyncUpdate);
        this.checkUpdate(true, false);
        return result;
    }
}
