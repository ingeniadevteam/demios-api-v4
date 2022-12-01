'use strict';

const MongoClient = require('mongodb').MongoClient;
const createUser = require('./create');

module.exports = async (roles, orgs) => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        const db = client.db(process.env.MONGO_DATABASE);

        // managers
        const managerRole = roles.mongo.find(r => r.type === 'manager');
        let users = await db.collection("users-permissions_user").find({
            role: managerRole._id
        }, {
            sort: { createdAt: -1 },
            limit: parseInt(process.env.USERS_MIGRATION),
        }).toArray();
        
        for (const user of users) {          
            await createUser(user, roles, orgs);
        }
        
        // validators
        const validatorRole = roles.mongo.find(r => r.type === 'validator');
        users = await db.collection("users-permissions_user").find({
            role: validatorRole._id
        }, {
            sort: { createdAt: -1 },
            limit: parseInt(process.env.USERS_MIGRATION),
        }).toArray();
            
        for (const user of users) {          
            await createUser(user, roles, orgs);
        }
        
        // employees
        const employeeRole = roles.mongo.find(r => r.type === 'employee');
        users = await db.collection("users-permissions_user").find({
            role: employeeRole._id
        }, {
            sort: { createdAt: -1 },
            limit: parseInt(process.env.USERS_MIGRATION),
        }).toArray();
            
        for (const user of users) {          
            await createUser(user, roles, orgs);
        }
        
        client.close();
        
    } catch (e) {
         console.error(`${e.message}`); return;
    }
};
