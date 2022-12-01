const suppliersdupplicates = require('./suppliers-dupplicates');
const suppliersRejected = require('./suppliers-rejected');

const argv = process.argv;
const cmd = argv[2];
const del = argv[3] === 'delete';

const run = async () => {
    if (cmd === 'dupplicates') {
        await suppliersdupplicates();
    } else if (cmd === 'rejected') {
        await suppliersRejected();
    }
}

run();