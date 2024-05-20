import { Data, Res } from "../model";

export interface Uploader<
        Base extends object, 
        Succeed extends Base
    >{
    upload(parameters:Data<Base> & {[options:string]:any}):Promise<Res<Succeed>>
}  

