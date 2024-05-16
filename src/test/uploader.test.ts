import { assert, assertType, describe, test } from "vitest"
import DAO from "../dao"
import { PostgreSQLData } from "../model/postgreSQL.model"
import { User, UserInfo, getConfig } from "../model/csv_model/user.model"
import { Res } from "../model"

describe("test PostgreSql uploader", () => {
    const pm = DAO.pm
    const data: PostgreSQLData<UserInfo> = {
        valids: [
            {
                name: "luis",
                email: "valid@mail.com",
                age: 15,
                row: 0,
                role: "user",
            },
        ],
        errors: [],
        config: getConfig,
    }
    test("upload list of parsed csv file", async () => {
        const res = await pm.upload(data)
        assertType<Res<User>>(res)
        const user = res.data.success[0]
        assert.equal(user.name, data.valids[0].name)
        assert.equal(user.email, data.valids[0].email)
        assert.equal(user.age, data.valids[0].age)
        assert.equal(user.role, data.valids[0].role)
        assertType<number>(user.id)
    })
    test("test some values", async () => {
        data.valids.push({
            row: 1,
            name: "alfonso",
            email: "miguel@fonso",
            role: "admin",
            age: 9,
        })
         data.valids.push({
            row: 2,
            name: "alfonso miguel",
            email: "miguel@fonso2",
            role: "admin",
            age: 9,
        }),
         data.valids.push({
            row: 3,
            name: "testino",
            email: "miguele@fonso",
            role: "user",
            age: 9,
        })
    const res = await pm.upload(data)
    assert.equal(res.data.success.length, 3)
    // test duplicate Unique key error  
    assert.equal(res.data.errors[0].row, data.valids[0].row)
    console.log(res.data.errors[0])
    })
})
