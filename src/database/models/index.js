import { Sequelize } from 'sequelize';
import config from '../config/database.js';

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

export default sequelize;