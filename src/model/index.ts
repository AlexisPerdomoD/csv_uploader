export type CsvIssues = {
    row: number
    details: {
        [key: string]: string
    }
}
// base model interface extends object, requires every csv model to be an object
export interface B extends Object {}
// type used to save row position from csv file while validations
export interface Indexed extends B {row: number}
// type used to references the returning values from postgreSQL insertions 
export interface Succeed extends B {id:number}
// type used to carry Indexed types and at the same time the CsvIssues types from the rows that did not successfully validate their fields.
export type Data<Indexed> = {
    valids: Indexed[]
    errors: CsvIssues[]
}
// type used to send the final response with the Succeed type from insertions to db and the information about the ones that did not make it.
export type Res<T> = {
    ok: true
    data: {
        success: T[]
        errors: CsvIssues[]
    }
}

// ```json
// {
// 	"ok": true,
// 	"data": {
// 	  "success": [
// 	    {
// 	      "id": 1,
// 	      "name": "Juan Perez",
// 	      "email": "juan.perez@example.com",
// 	      "age": 28
// 	    }
// 	    // Otros registros exitosos...
// 	  ],
// 	  "errors": [
// 	    {
// 	      "row": 4,
// 	      "details": {
// 	        "name": "El campo 'name' no puede estar vacío.",
// 	        "email": "El formato del campo 'email' es inválido.",
// 	        "age": "El campo 'age' debe ser un número positivo."
// 	      }
// 	    }
// 	    // Otros registros con errores...
// 	  ]
// 	}
// }
// ```
