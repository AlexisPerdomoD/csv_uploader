import { config } from "dotenv"

config({
    path: ".env",
})
const {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    ENDPOINT_ID,
    PORT,
    SECRET_TOKEN,
    SECRET_COOKIE,
    HOST
} = process.env
export default {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    ENDPOINT_ID,
    PORT,
    SECRET_TOKEN,
    SECRET_COOKIE,
    HOST
}

