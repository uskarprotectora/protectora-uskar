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

        const username = await question('Enter username: ');

        const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
        if (existingAdmin) {
            console.log('User already exists: ' + existingAdmin.username + ' (role: ' + existingAdmin.role + ')');
            const overwrite = await question('Do you want to update the password? (y/n): ');

            if (overwrite.toLowerCase() !== 'y') {
                console.log('Aborted.');
                rl.close();
                process.exit(0);
            }

            const password = await question('Enter new password (min 8 chars): ');
            if (password.length < 8) {
                console.error('Password must be at least 8 characters');
                rl.close();
                process.exit(1);
            }

            existingAdmin.password = password;
            await existingAdmin.save();
            console.log('Password updated for: ' + existingAdmin.username);
        } else {
            const password = await question('Enter password (min 8 chars): ');
            if (password.length < 8) {
                console.error('Password must be at least 8 characters');
                rl.close();
                process.exit(1);
            }

            const roleInput = await question('Enter role (admin/colaborador) [default: admin]: ');
            const role = roleInput.toLowerCase() === 'colaborador' ? 'colaborador' : 'admin';

            const admin = new Admin({ username, password, role });
            await admin.save();
            console.log('User created: ' + username + ' (role: ' + role + ')');
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
