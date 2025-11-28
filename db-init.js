
db = db.getSiblingDB('linkdev')
db.createUser({
    user: process.env.DB_USER,
    pwd: process.env.DB_PASS,
    roles: [{ role: 'dbOwner', db: 'linkdev' }],
})
