import mongoose from "mongoose";
import appConfig from "../config/app_config.json" assert { type: "json" };

const connection = async () => {
  try {
    await mongoose.connect(appConfig.uri);
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log(`err msg of mongoose ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
export default connection;
