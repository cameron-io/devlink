
let e = process.env

const uri =
    `mongodb://${e.DB_USER}:${e.DB_PASS}@${e.DB_HOST}:${e.DB_PORT}/${e.DB_NAME}`

export default uri
