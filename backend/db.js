import mysql from "mysql"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"expencetrackerdb",
    password:"isy987"
})