'use strict';

require('dotenv').config();
const { writeFileSync } = require('fs');
const { MongoClient, ObjectId } = require('mongodb');


module.exports = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        const db = client.db(process.env.MONGO_DATABASE);
        
        console.log('Suppliers rejected check:',
            await db.collection('suppliers').countDocuments({status: 'rejected' }));

        const roles = await db.collection("users-permissions_role").find().toArray();
        const supplierRole = roles.find(r => r.type === 'supplier');

        const rejectedSuppliers = await db.collection('suppliers').find({ status: 'rejected' }).toArray();

        const deleted = {
            users: [],
            suppliers: []
        };

        for (const sup of rejectedSuppliers) {
            const invoices = await db.collection('invoices').countDocuments({ supplier: sup._id });
            const contracts = await db.collection('contracts').countDocuments({ supplier: sup._id });
            const purchases = await db.collection('purchases').countDocuments({ supplier: sup._id });
            const invoicesTraces = await db.collection('invoices-traces').countDocuments({ supplier: sup._id });
            const user = await db.collection('users-permissions_user').findOne({
                email: sup.email,
                role: supplierRole._id
            });

            // console.log(
            //     invoices,
            //     contracts,
            //     purchases,
            //     invoicesTraces,
            //     user ? user.createdAt.toLocaleDateString() : 'NO USER',
            //     user ? user.email : '',
            // );

            if (invoices + contracts + purchases + invoicesTraces === 0) {
                console.log("DELETE SUPPLIER", sup.email, user ? 'USER' : '', user ? user.email : 'NO USER');
                if (del) {
                    await db.collection('suppliers').deleteOne({ _id: sup._id });
                }
                deleted.suppliers.push(sup);
                if (user) {
                    if (del) {
                        await db.collection('users-permissions_user').deleteOne({ _id: user._id });
                    }
                    console.log("DELETE USER", user.email);
                    deleted.users.push(user);
                }
            }
        }
    
        client.close();

        if (del) {
            await writeFileSync(`${__dirname}/output/deleted.json`, JSON.stringify(deleted, null, 4));
            console.log('DELETED SUPPLIERS', deleted.suppliers.length);
        }
    } catch (e) {
        console.error(`${e.message}`);
    }
};
    