// db = db.getSiblingDB("admin");
// db.createUser({
//   user: process.env.MONGODB_INITDB_ROOT_USERNAME,
//   pwd: process.env.MONGODB_INITDB_ROOT_PASSWORD,
//   roles: [{ role: "readWrite", db: "admin" }]
// });

db = db.getSiblingDB('linkdev');
db.createUser({
    user: process.env.DATABASE_USER,
    pwd: process.env.DATABASE_PASS,
    roles: [{ role: 'dbOwner', db: 'linkdev' }]
});