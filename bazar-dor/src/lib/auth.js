import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// MongoDB connection client
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("bazardor");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
    client,
  }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "dummy_google_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_google_secret",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "dummy_github_id",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy_github_secret",
        }
    }
});