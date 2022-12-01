'use strict';

require('dotenv').config();
const { writeFileSync } = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const del = process.argv[3] === 'delete';

module.exports = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        const db = client.db(process.env.MONGO_DATABASE);
        
        console.log('Suppliers check:', await db.collection('suppliers').count());

        const taxiddupplicates = await db.collection('suppliers').aggregate([
            {"$group" : { "_id": "$taxid", "name": { "$first": "$name"}, "count": { "$sum": 1 } } },
            {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } }, 
            {"$project": {"taxid" : "$_id", "_id" : 0} }
        ]);
    
        const deleted = {
            users: [],
            suppliers: []
        };

        for (let duplicate = await taxiddupplicates.next(); duplicate != null; duplicate = await taxiddupplicates.next()) {
            if (duplicate.taxid === '') {
                continue;
            }
            if (duplicate.taxid === 'SIN_DEFINIR') {
                continue;
            }

            const duplicatedSuppliers = await db.collection('suppliers').find({ taxid: duplicate.taxid }).toArray();
            console.log('CIF', duplicate.taxid, duplicatedSuppliers.length);

            // check user with createdAt
            for (const sup of duplicatedSuppliers) {
                const invoices = await db.collection('invoices').countDocuments({ supplier: sup._id });
                const contracts = await db.collection('contracts').countDocuments({ supplier: sup._id });
                const purchases = await db.collection('purchases').countDocuments({ supplier: sup._id });
                const invoicesTraces = await db.collection('invoices-traces').countDocuments({ supplier: sup._id });
                const user = await db.collection('users-permissions_user').findOne({ email: sup.email });
                
                // console.log(
                //     invoices,
                //     contracts,
                //     purchases,
                //     invoicesTraces,
                //     user ? user.createdAt.toLocaleDateString() : 'NO USER',
                //     user ? user.email : '',
                // );

                if (invoices + contracts + purchases + invoicesTraces === 0) {
                    console.log("DELETE SUPPLIER", sup._id.toString(), user ? 'USER' : '', user ? user._id.toString() : 'NO USER');
                    if (del) {
                        await db.collection('suppliers').deleteOne({ _id: sup._id });
                    }
                    deleted.suppliers.push(sup);
                    if (user) {
                        if (del) {
                            await db.collection('users-permissions_user').deleteOne({ _id: user._id });
                        }
                        deleted.users.push(user);
                    }
                }
                
            }

            // // check user with createdAt
            // for (const sup of duplicatedSuppliers) {
            //     // const invoices = await db.collection('invoices').find(
            //     //     { supplier: sup._id },
            //     //     { number: 1 }
            //     // ).toArray();

            //     // const contracts = await db.collection('contracts').find(
            //     //     { supplier: sup._id },
            //     //     { description: 1 }
            //     // ).toArray();

            //     // const purchases = await db.collection('purchases').find(
            //     //     { supplier: sup._id },
            //     //     { description: 1 }
            //     // ).toArray();

            //     // const invoicesTraces = await db.collection('invoices-traces').find(
            //     //     { supplier: sup._id },
            //     //     { description: 1 }
            //     // ).toArray();

            //     // const user = await db.collection('users-permissions_user').findOne({ email: sup.email });
            // }
        }
    
        client.close();

        if (del) {
            await writeFileSync(`${__dirname}/output/deleted.json`, JSON.stringify(deleted, null, 4));
            console.log('DELETED SUPPLIERS', deleted.suppliers.length);
            console.log('DELETED USERS', deleted.users.length);
        }
    } catch (e) {
        console.error(`${e.message}`);
    }
};
    