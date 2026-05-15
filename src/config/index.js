import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";

const config = databaseConfig.development;

const connection = new Sequelize(config);

export default connection;