import {assert, assertType, describe, test} from "vitest";
import {UserInfo, userSchema} from "../model/csv_model/user.model";
import {validateFile} from "../utility/validateFile.util"
import {Data} from "../model";
import path from "path";
describe('test validate csv file function', ()=>{
    test('test 5 rows not errors', async()=>{
        const p = path.join(__dirname, '/data/users.csv')
        
        const res = await validateFile<UserInfo>(p, userSchema)
        console.log(res.errors) 
        assertType<Data<UserInfo & {row:number}>>(res)
        
        assert.equal(res.valids.length, 5 )
        assert.equal(res.errors.length, 3)
     })
}) 
