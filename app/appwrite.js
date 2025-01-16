import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("658021b595082e4d07bd"); // Replace with your project ID

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
export { ID } from "appwrite";
