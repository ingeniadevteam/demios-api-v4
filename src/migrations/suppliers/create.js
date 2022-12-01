'use strict';

const MongoClient = require('mongodb').MongoClient;
const createUser = require('../users/create');

module.exports = async (supplier, roles, orgs) => {
    const existingSupplier = await strapi.query('api::supplier.supplier')
        .findOne({ where: { email: supplier.email } });
    
    if (existingSupplier) {
        return;
    }

    console.log('createSupplier', supplier.name);

    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    const db = client.db(process.env.MONGO_DATABASE);

    // get the related user
    let users = [];
    const mongoUser = await db.collection("users-permissions_user").findOne({supplier: supplier._id });
    if (mongoUser) {
        const userNew = await createUser(mongoUser, roles, orgs);
        users = [userNew.id];
    }
    // setup approvedBy
    let localApprovedBy;
    if (supplier.approvedBy) {
        const mongoApprovedBy = await db.collection("users-permissions_user").findOne({_id: supplier.approvedBy });
        client.close();
        localApprovedBy = await createUser(mongoApprovedBy, roles, orgs);
    }

    await strapi.service('api::supplier.supplier').create({ data: {
        name: supplier.name,
        email: supplier.email,
        business: supplier.business,
        taxid: supplier.taxid,
        type: supplier.type ? supplier.type : 'supplier',
        paymentMethod: supplier.paymentMethod ? supplier.paymentMethod : 'transfer',
        days: `D${supplier.days ? supplier.days : '30'}`,
        terms: supplier.terms,
        bic: supplier.bic,
        status: supplier.status,
        approvedBy: localApprovedBy ? localApprovedBy.id : null,
        users
    }});
};
