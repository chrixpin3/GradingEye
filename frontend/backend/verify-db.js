import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Response from './models/Response.js';

dotenv.config();

const verify = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected Successfully.");

        const count = await Response.countDocuments();
        console.log(`Total documents in 'corrected' collection: ${count}`);

        if (count > 0) {
            const last = await Response.findOne().sort({ createdAt: -1 });
            console.log("Last entry ID:", last._id);
            console.log("Student Name:", last.student_name);
        }

        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log("All Databases on Server:", dbs.databases.map(d => d.name));

        for (const dbInfo of dbs.databases) {
            const dbRef = mongoose.connection.useDb(dbInfo.name);
            const colls = await dbRef.db.listCollections().toArray();
            if (colls.some(c => c.name === 'corrected')) {
                const count = await dbRef.collection('corrected').countDocuments();
                console.log(`Found 'corrected' collection in DB '${dbInfo.name}' with ${count} docs.`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
};

verify();
