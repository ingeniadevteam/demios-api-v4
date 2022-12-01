'use strict';

const MongoClient = require('mongodb').MongoClient;
const createUser = require('../users/create');

module.exports = async (organization, roles, orgs) => {
    const existing = await strapi.query('api::organization.organization')
        .findOne({ where: { name: organization.name } });
    if (existing)
        return;
    
    console.log('createOrganization', organization.name);
    
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    const db = client.db(process.env.MONGO_DATABASE);
    
    let invoicePayer,
        orderValidator,
        orgAdmon,
        orgManager,
        ticketPayerCompanyInvoice,
        ticketPayerOther,
        ticketRegistrarCompanyInvoice,
        ticketRegistrarOther,
        issueOrderManager,
        issueInvoiceRejectedManager,
        issuePaymetNotReceivedManager,
        issueTechnicalManager,
        issueOtherManager;
        
    let invoicePayerNew,
        orderValidatorNew,
        orgAdmonNew,
        orgManagerNew,
        ticketPayerCompanyInvoiceNew,
        ticketPayerOtherNew,
        ticketRegistrarCompanyInvoiceNew,
        ticketRegistrarOtherNew,
        issueOrderManagerNew,
        issueInvoiceRejectedManagerNew,
        issuePaymetNotReceivedManagerNew,
        issueTechnicalManagerNew,
        issueOtherManagerNew;

    let validatorsNew = [],
        orgAdmonsObraNew = [];

    if (organization.invoicePayer) {
        invoicePayer = await db.collection("users-permissions_user").findOne({_id: organization.invoicePayer });
        if (invoicePayer) {
            invoicePayerNew = await createUser(invoicePayer, roles, orgs);
        }
    }
    if (organization.orderValidator) {
        orderValidator = await db.collection("users-permissions_user").findOne({_id: organization.orderValidator });
        if (orderValidator) {
            orderValidatorNew = await createUser(orderValidator, roles, orgs);
        }
    }
    if (organization.orgManager) {
        orgManager = await db.collection("users-permissions_user").findOne({_id: organization.orgManager });
        if (orgManager) {
            orgManagerNew = await createUser(orgManager, roles, orgs);
        }
    }
    if (organization.orgAdmon) {
        orgAdmon = await db.collection("users-permissions_user").findOne({_id: organization.orgAdmon });
        if (orgAdmon) {
            orgAdmonNew = await createUser(orgAdmon, roles, orgs);
        }
    }
    if (organization.ticketPayerCompanyInvoice) {
        ticketPayerCompanyInvoice = await db.collection("users-permissions_user").findOne({_id: organization.ticketPayerCompanyInvoice });
        if (ticketPayerCompanyInvoice) {
            ticketPayerCompanyInvoiceNew = await createUser(ticketPayerCompanyInvoice, roles, orgs);
        }
    }
    if (organization.ticketPayerOther) {
        ticketPayerOther = await db.collection("users-permissions_user").findOne({_id: organization.ticketPayerOther });
        if (ticketPayerOther) {
            ticketPayerOtherNew = await createUser(ticketPayerOther, roles, orgs);
        }
    }
    if (organization.ticketRegistrarCompanyInvoice) {
        ticketRegistrarCompanyInvoice = await db.collection("users-permissions_user").findOne({_id: organization.ticketRegistrarCompanyInvoice });
        if (ticketRegistrarCompanyInvoice) {
            ticketRegistrarCompanyInvoiceNew = await createUser(ticketRegistrarCompanyInvoice, roles, orgs);
        }
    }
    if (organization.ticketRegistrarOther) {
        ticketRegistrarOther = await db.collection("users-permissions_user").findOne({_id: organization.ticketRegistrarOther });
        if (ticketRegistrarOther) {
            ticketRegistrarOtherNew = await createUser(ticketRegistrarOther, roles, orgs);
        }
    }
    if (organization.issueOrderManager) {
        issueOrderManager = await db.collection("users-permissions_user").findOne({_id: organization.issueOrderManager });
        if (issueOrderManager) {
            issueOrderManagerNew = await createUser(issueOrderManager, roles, orgs);
        }
    }
    if (organization.issueInvoiceRejectedManager) {
        issueInvoiceRejectedManager = await db.collection("users-permissions_user").findOne({_id: organization.issueInvoiceRejectedManager });
        if (issueInvoiceRejectedManager) {
            issueInvoiceRejectedManagerNew = await createUser(issueInvoiceRejectedManager, roles, orgs);
        }
    }
    if (organization.issuePaymetNotReceivedManager) {
        issuePaymetNotReceivedManager = await db.collection("users-permissions_user").findOne({_id: organization.issuePaymetNotReceivedManager });
        if (issuePaymetNotReceivedManager) {
            issuePaymetNotReceivedManagerNew = await createUser(issuePaymetNotReceivedManager, roles, orgs);
        }
    }
    if (organization.issueTechnicalManager) {
        issueTechnicalManager = await db.collection("users-permissions_user").findOne({_id: organization.issueTechnicalManager });
        if (issueTechnicalManager) {
            issueTechnicalManagerNew = await createUser(issueTechnicalManager, roles, orgs);
        }
    }
    if (organization.issueOtherManager) {
        issueOtherManager = await db.collection("users-permissions_user").findOne({_id: organization.issueOtherManager });
        if (issueOtherManager) {
            issueOtherManagerNew = await createUser(issueOtherManager, roles, orgs);
        }
    }

    if (organization.validators) {
        for (const _id of organization.validators) {
            const current = await db.collection("users-permissions_user").findOne({ _id });
            if (current) {
                validatorsNew.push(await createUser(current, roles, orgs));
            }
        }
    }
    
    if (organization.orgAdmonsObra) {
        for (const _id of organization.orgAdmonsObra) {
            const current = await db.collection("users-permissions_user").findOne({ _id });
            if (current) {
                orgAdmonsObraNew.push(await createUser(current, roles, orgs));
            }
        }
    }

    // console.log(
    //     invoicePayer ? '' : 'No invoicePayer',
    //     orderValidator ? '' : 'No orderValidator',
    //     orgAdmon ? '' : 'No orgAdmon',
    //     orgManager ? '' : 'No orgManager',
    //     ticketPayerCompanyInvoice ? '' : 'No ticketPayerCompanyInvoice',
    //     ticketPayerOther ? '' : 'No ticketPayerOther',
    //     ticketRegistrarCompanyInvoice ? '' : 'No ticketRegistrarCompanyInvoice',
    //     ticketRegistrarOther ? '' : 'No ticketRegistrarOther',
    //     issueOrderManager ? '' : 'No issueOrderManager',
    //     issueInvoiceRejectedManager ? '' : 'No issueInvoiceRejectedManager',
    //     issuePaymetNotReceivedManager ? '' : 'No issuePaymetNotReceivedManager',
    //     issueTechnicalManager ? '' : 'No issueTechnicalManager',
    //     issueOtherManager ? '' : 'No issueOtherManager',
    // );

    client.close();
    
    return await strapi.service('api::organization.organization').create({ data: {
        name: organization.name,
        office: organization.office,
        nameNumber: organization.nameNumber,
        officeNumber: organization.officeNumber,
        email: organization.email,
        purchaseLessThan: organization.purchaseLessThan,
        purchaseMoreThan: organization.purchaseMoreThan,
        enableValidatorList: organization.enableValidatorList,
        invoicePayer: invoicePayerNew ? invoicePayerNew.id : null,
        orderValidator: orderValidatorNew ? orderValidatorNew.id : null,
        orgAdmon: orgAdmonNew ? orgAdmonNew.id : null, 
        orgManager: orgManagerNew ? orgManagerNew.id : null,
        ticketPayerCompanyInvoice: ticketPayerCompanyInvoiceNew ? ticketPayerCompanyInvoiceNew.id : null,
        ticketPayerOther: ticketPayerOtherNew ? ticketPayerOtherNew.id : null,
        ticketRegistrarCompanyInvoice: ticketRegistrarCompanyInvoiceNew ? ticketRegistrarCompanyInvoiceNew.id : null,
        ticketRegistrarOther: ticketRegistrarOtherNew ? ticketRegistrarOtherNew.id : null,
        issueOrderManager: issueOrderManagerNew ? issueOrderManagerNew.id : null,
        issueInvoiceRejectedManager: issueInvoiceRejectedManagerNew ? issueInvoiceRejectedManagerNew.id : null,
        issuePaymetNotReceivedManager: issuePaymetNotReceivedManagerNew ? issuePaymetNotReceivedManagerNew.id : null,
        issueTechnicalManager: issueTechnicalManagerNew ? issueTechnicalManagerNew.id : null,
        issueOtherManager: issueOtherManagerNew ? issueOtherManagerNew.id : null,
        orgAdmonsObra: orgAdmonsObraNew.map(u => u.id),
        validators: validatorsNew.map(u => u.id),
    }});
};
