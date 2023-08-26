import { MongoClient } from "mongodb";

const url = "mongodb://172.16.17.209:27017";

let client;
export const connectToMongoDB = () => {
  MongoClient.connect(url)
    .then((clientInstance) => {
      client = clientInstance;
      console.log(clientInstance);
      console.log("Mongodb is connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClient = () => {
  return client;
}

export const getDB = () => {
  return client.db("ExpenZap");
};
