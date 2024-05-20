
# Csv Uploader

This API REST is pretended to be a core implementation for uploading CSV files into diferent data bases, including general methods agnostic to the model from these files with the chance to implement specific models' endpoints. 

This app built an strong base for specific implementations where validate fields of the rows into the csvs tables is critical, uploading by default those rows that meets the validations models and information about those which did not.

Csv uploader is a very good option to implement a robust and very detail fields' validation to your migration from csv tables to diferent data bases model. 

By default , this Api implement a PostgreSQL for login and session admin users endpoints, an users model used to validate fields and upload csv users tables, endpoint to upload the csv files and endpoint to revalidate rows through json type files instead of csv Files. We'll explore more about this dowm below. 

> this proyect is considered totally open source, any contribution through pull request or comments that helps to keep increasing features are more than welcome!


##
<div align="center">
  <img with="60px" src="https://www.maketecheasier.com/assets/uploads/2013/05/Free-Open-Source-Icon.png" alt="logo"  />
</div>

## Content
1) [Feactures](#feactures)
2) [Tecnologies](#tecnologies) 
3) [Requirements](#requirements)
4) [Setup](#setup)
5) [Endpoints](#endpoints)
6) [View Endpoints](#view-endpoints)
7) [Authentication](#authentication)
8) [Contributions](#contribution)
9) [How to reach me](#links)

## Feactures

- Easy configuration to quickly start updating your CSV models. 

- Strong model structures powered by Typestript and Zod library to implement specific validations for every csv model and end point.

- High limit of file size, which by default is 10MB.

- Smart implementation of memory use. This is because files are not completly store in memory, instead this app store files in a temp directory while parsing an validations takes place an remove it before sending a Response. 

- The App will verify wheter your file is corrupt or valid, storage it in a safe place temporaly, parse it and validate every field of every row of the csv process, uploading those wich pass those filters and returning by row details of what was wrong with those which did not make it.   
- Strong Error Handler centralizated, custom Error interface and small custom error library with the chance of increasing for future implementations from diferents databases.

- Strong session validations for  protected endpoints, only admin users are by default able to upload to users.

> including the chance for the future diferent level of permisition for diferent upload endpoinds. 

## Tecnologies
This Aplication is builded using Typescript in Node js work enviroment with Express as Framework and PostgreSQL to be used in the persistent layer,  more detail information about libraries and dependencies used can be checked in the package.json file.

<div align="center" style="display:flex;">
    <img width="48" height="48" src="https://img.icons8.com/color/48/nodejs.png" alt="NODE js"/>  
    <img width="48" height="48" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-typescript-an-open-source-programming-language-developed-and-maintained-by-microsoft-logo-color-tal-revivo.png" alt="Typescript"/>
    <img width="48" height="48" src="https://img.icons8.com/offices/30/express-js.png" alt="express js"/>
    <img width="48" height="48" src="https://img.icons8.com/plumpy/48/json.png" alt="JWT"/>
    <img width="48" height="48" src="https://img.icons8.com/color/48/sql.png" alt="SQL"/>
    <img width="48" height="48" src="https://img.icons8.com/color/48/postgreesql.png" alt="PostGreSQL"/>
</div>

## Requirements

Is needed in order to run this project to have install in your work enviroment Node js 20, npm 9 and a conection to a PostgreSQL database to handle admin sesions and any oher conection to others db for implementing another persistence for your uploads. 

## Setup 

In this section we're gonna explore the minimum configurations and commands in order to run this app properly.
First clone the repository in your work enviroment and enter to the root directory.
There is a .env file to be set, this is an example of this file must look like.

```.env
PGHOST='example.host'
PGDATABASE='name_of_data_base'
PGUSER='user_name'
PGPASSWORD='password'
PORT=4000
MODE=PRO 
SECRET_TOKEN="secret_1"
SECRET_COOKIE="secret_2"
HOST='*'

```

##### Variables required by pg ( for PostgreSQL client config): 
 * `PGHOST`: references the host of your postgres db.

 * `PGDATABASE`: references the name of your postgres db.

 * `PGPASSWORD`:references the password of postgres db user.

 * `PGUSER`: Usuario a utilizar para conectar a la base de datos.

 > more details about this in the file pg.config.ts in config directory and more information about PoolClient on [Pool Client pg](https://node-postgres.com/apis/pool).

> if you need another db driver implementation like, for example, mongosee for MongoDB, it's important to set connection string and other variables here too.

##### General variables
* `PORT`: references the port the app is running.

* `HOST`: references the Host the App is serving, this is Cors related, be careful.

* `SECRET_TOKEN`: this must be an string that will be used to sign tokens and validate incoming sesions tokens.

* `SECRET_COOKIE`: this must be also an string that will be used to sign cookies and validate them when protected endpoint's requested take places.

### Start the app

After setting up the .env file the next thing to do is run the following comands:
```bash
npm install
```
installing all dependencies.
```bash
npm run dev
```
if you are in a develop process implementing an specific model, etc, also getting more logs information and real time changes updates throught nodemon.
```bash
npm run build && npm start
```
to build the app and start listining on the selected port. 

> more information about the scripts can be found in the package.json file.

### Project structure 
This project follow diferent layers structures in order to have room to horizontal growing in the future, listing specific directorys by task or responsability and keep clean code practices. 

```
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── src
│   ├── app.ts
│   ├── config
│   ├── controller
│   ├── dao
│   ├── index.ts
│   ├── middleware
│   ├── model
│   ├── route
│   ├── table
│   ├── test
│   └── utility
└── tsconfig.json
```
`config`: this directory contains diferent setup files such client for data bases config, PostgreSql driver pg stays here for example, dotenv library config to handle enviroment variables and others libraries such loggers related, etc.

`controller`: this directory contains the methods required to recive and validate data coming from the requests, call the Managers or Uploaders (persistence layer), format the response or throw an error if necessary.

`dao`: this directory contains the persistence logic, index files from this directory contains DataAccessObject class which is where every Uploader (classes in charge of upload Csv Model data bases) and Managers (classes in charge of getting, updating and deleting data from those data bases and also in charge of Api funcionality related). There is where you can find for example, Uploader interface PostgresQL models implementation (Uploader interface is the generic way of commun methods to be used inside the dao Class to be exported) and also UserManager(class implemented to handle methods such CRUD operations over admins accounts)

> more information about this topic in the following section.

`middleware`: this directory contains all middlewares implemented in the app. The principal are: 

- Authentication middleware, which validates the session for protected endpoints, the way it works is validating the signed token stored into the sign cookie, including two security checking lawers even before validations in the controller layer.

- Csv validation middleware, which validates files integrity and related.

- Errors middleware, since this API manage a centralized error handling, this is the place where ApiCustomError class instances (more details about this Api class for Custom errors implementations in error directory inside models directory), data base errors and general Error intances are manage and send the proper response to the client.
  
- Logger middeware, which by default gives information in console about the request incoming.

`route`: this directory includes the diferent routers uses by express and sets specific routes with controllers and models required.

`utility`: includes diferent methods used for specific small things, such hashing etc.

`test`: this directory includes diferent test using vitest library, in process...

`table`: includes sql tables used in the app for references porpuses.

`model`: this directory includes all models used in the app, models validations get done by using ![Zod library](https://zod.dev/), this allows a simple and practical way to validated ts models (referencing an csv model) to insert into the data bases ensuring not errors and also providing custom messages for errors.
this directory by default contains: 
```
src/model
├── csv_model
│   ├── index.ts
│   └── user.model.ts
├── error
│   └── error.model.ts
├── index.ts
├── postgreSQL.model.ts
└── user.model.ts
```
 > This is the core structure, from here you can include your own implementations and set specific endpoints based on those. More information can be found in this files explaining the models exposed there. 

 - index file from model directory contains general types uses in all the app.
 
 - postgreSQL.model.ts includes specific types or interfaces extentions from the general ones used for postgres methods and class implementations.
 
 - user.model is types and interfaces APi users and admin relate, being implement into managers. 
   
 - csv_model contains models used to validate csv files, index file in this directory includes especial zod types such numbers validations for example( since every csv rows are parsed into a json with all values as string) and also includes specific user model used to upload the users_csv table into postgresQl.

 - error directory contains everything error models and types relate, by default includes the ApiCustomError which extends generic Error class and is used to handle an basic error diccionary along with ErrorCodes enums to be implement and uses in all part. if you need to include types or extends this class, the right directory to place them is error. More information is detailed into the error.model.ts.

   
 - in process...

