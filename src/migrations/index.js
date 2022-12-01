'use strict';

const MongoClient = require('mongodb').MongoClient;
// const devData = require('./development');
const createOrg = require('./organizations/create');
const suppliers = require('./suppliers');
const users = require('./users');


module.exports = async () => {
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    const db = client.db(process.env.MONGO_DATABASE);

    const orgs = {
        mongoOrgs: await db.collection("organizations").find().toArray(),
        localOrgs: (await strapi.service('api::organization.organization').find()).results,
    }
    const roles = {
        local: await strapi.service('plugin::users-permissions.role').find(),
        mongo: await db.collection("users-permissions_role").find().toArray(),
    }
    client.close();
    
    /*
        START MIGRATIONS
    */

    // // organizations
    // for (const mOrg of mongoOrgs) {
    //     await createOrg(mOrg, roles, orgs);
    // }

    // // suppliers
    await suppliers(roles, orgs);

    // init users
    // await users(roles, orgs);
    
};
