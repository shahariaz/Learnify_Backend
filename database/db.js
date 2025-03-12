import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;
class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;
    //Config Mongo settings
    mongoose.set("strictQuery", false);
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
      this.isConnected = true;
    });
    mongoose.connection.on("error", (err) => {
      console.log(`Database connection error: ${err}`);
      this.isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
      this.isConnected = false;
      this.handleDisconnection();
    });
    process.on("SIGINT", this.handleAppTermination.bind(this));
  }
  async connect() {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("Mongo URI is required");
      }
      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      };
      if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
      }
      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      this.retryCount = 0;
    } catch (error) {
      console.log(`Error connecting to database: ${error}`);
      await this.handleConnectionError();
    }
  }
  async handleConnectionError() {
    if (this.retryCount >= MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `Max retries of ${MAX_RETRIES} exceeded. Exiting the process`
      );
      await new Promise((resolve) => setTimeout(() => resolve), RETRY_INTERVAL);
      return await this.connect();
    } else {
      console.log(
        `Retrying connection. Attempt ${this.retryCount} of ${MAX_RETRIES}`
      );
    }
  }
  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("Attemting to reconnect to database");
      await this.connect();
    }
  }
  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("Database connection terminated");
      process.exit(0);
    } catch (error) {
      console.log(`Error terminating database connection: ${error}`);
      process.exit(1);
    }
  }
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  }
}

//create an instance of the DatabaseConnection class
const dbConnection = new DatabaseConnection();
export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
