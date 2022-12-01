'use strict';

const MongoClient = require('mongodb').MongoClient;
const createSupplier = require('./create');

module.exports = async (roles, orgs) => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        const db = client.db(process.env.MONGO_DATABASE);

        const suppliers = await db.collection("suppliers").find({ }, {
            sort: { createdAt: -1 },
            limit: parseInt(process.env.SUPPLIERS_MIGRATION),
        }).toArray();
        
        client.close();
            
        for (const supplier of suppliers) {          
            await createSupplier(supplier, roles, orgs);
        }
        
    } catch (e) {
         console.error(`${e.message}`); return;
    }
};
