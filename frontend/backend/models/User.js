import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // Added email
    password: { type: String, required: true },
    // Optional: keep authenticators for future WebAuthn support if needed
    authenticators: [{
        credentialID: { type: String, required: true },
        credentialPublicKey: { type: String, required: true },
        counter: { type: Number, required: true },
        transports: [String],
    }],
    currentChallenge: { type: String },
    isFaceMFAEnabled: { type: Boolean, default: false },
    faceDescriptor: { type: [Number], default: [] },
});

const User = mongoose.model("User", userSchema);
export default User;
