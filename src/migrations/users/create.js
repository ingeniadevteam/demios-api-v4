'use strict';

const MongoClient = require('mongodb').MongoClient;

const createUser = async (mongoUser, roles, orgs) => {
    const existing = await strapi.query('plugin::users-permissions.user')
        .findOne({ where: { email: mongoUser.email } });
    if (existing) {
        return existing;
    }
    
    console.log('createUser', mongoUser.name);

    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    const db = client.db(process.env.MONGO_DATABASE);

    // ROLE ('validator => 'employee')
    const mongoRole = roles.mongo.find(r => r._id.toString() === mongoUser.role.toString());
    if (mongoRole.type === 'validator') {
        mongoRole.type = 'employee';
    }
    const localRole = roles.local.find(r => r.type === mongoRole.type);

    let ticketValidatorUserId, ticketValidatorUserIdNew;

    if (mongoUser.ticketValidatorUserId) {
        ticketValidatorUserId = await db.collection("users-permissions_user").findOne({_id: mongoUser.ticketValidatorUserId });
        if (ticketValidatorUserId) {
            ticketValidatorUserIdNew = await createUser(ticketValidatorUserId, roles, orgs);
        }
    }

    let mongoOrg, organization;
    if (mongoUser.organization) {
        mongoOrg = orgs.mongoOrgs.find(o => o._id.toString() === mongoUser.organization.toString());
    } else {
        mongoOrg = orgs.mongoOrgs.find(o => o.name === 'Campos Corporacion');
    }
    if (mongoOrg) {
        organization = orgs.localOrgs.find(o => o.name === mongoOrg.name);
    }
    
    client.close();

    return await strapi.plugins['users-permissions'].services.user.add({
        // supplier: [...ids],
        organization: organization ? organization.id : null,
        role: localRole.id,
        isSupplier: localRole.type === 'supplier' ? true : false,
        ticketValidatorUserId: ticketValidatorUserIdNew ? ticketValidatorUserIdNew.id : null,
        name: mongoUser.name,
        username: mongoUser.email,
        email: mongoUser.email,
        provider: "local",
        password: Math.random().toString(36).slice(-8),
        confirmed: mongoUser.confirmed,
        blocked: mongoUser.blocked,
        supplierValidator: mongoUser.supplierValidator,
        invoiceValidator: mongoUser.invoiceValidator,
        invoicePayer: mongoUser.invoicePayer,
        ticketValidator: mongoUser.ticketValidator,
        ticketPayer: mongoUser.ticketPayer,
        ticketRegistrar: mongoUser.ticketRegistrar,
        ticketAdmin: mongoUser.ticketAdmin,
        orderValidator: mongoUser.orderValidator,
        orgManager: mongoUser.orgManager,
        orgAdmon: mongoUser.orgAdmon,
        purchaseAdmonObra: mongoUser.purchaseAdmonObra,
        foreman: mongoUser.foreman,
        issueManager: mongoUser.issueManager,
    });
};


module.exports = createUser;