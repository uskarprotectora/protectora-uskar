const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const Admin = require('./models/Admin');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => rl.question(prompt, resolve));
}

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petcustomer');
        console.log('Connected to MongoDB');

        const existingAdmin = await Admin.findOne({});
        if (existingAdmin) {
            console.log('Admin already exists: ' + existingAdmin.username);
            const overwrite = await question('Do you want to update the password? (y/n): ');

            if (overwrite.toLowerCase() !== 'y') {
                console.log('Aborted.');
                rl.close();
                process.exit(0);
            }
        }

        const username = await question('Enter admin username: ');
        const password = await question('Enter admin password (min 8 chars): ');

        if (password.length < 8) {
            console.error('Password must be at least 8 characters');
            rl.close();
            process.exit(1);
        }

        if (existingAdmin) {
            existingAdmin.password = password;
            await existingAdmin.save();
            console.log('Admin password updated for: ' + existingAdmin.username);
        } else {
            const admin = new Admin({ username, password });
            await admin.save();
            console.log('Admin created: ' + username);
        }

        console.log('Done!');
        rl.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        rl.close();
        process.exit(1);
    }
}

seedAdmin();
