// index.js
import dbConfig from '../db.js';
import { Sequelize, DataTypes } from 'sequelize';
import UserInit from './user.js'; // Import your user module with ES6 syntax
import PostInit from './post.js'; // Import your post module with ES6 syntax

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
        connectTimeout: 60000,
        pool: {
            max: 5, // Maximum number of connections in the pool
            min: 0, // Minimum number of connections in the pool
            acquire: 30000, // Maximum time (in milliseconds) to acquire a connection
            idle: 10000, // Maximum time (in milliseconds) a connection can be idle before being released
        },
});

sequelize.authenticate()
    .then(() => {
        console.log('connected..');
    })
    .catch(err => {
        console.log('Error' + err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserInit(sequelize);  // Use the imported user module
db.Post = PostInit(sequelize);// Use the imported post module

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!');
    });

// Export the db object
export default db;
