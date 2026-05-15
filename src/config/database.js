export default {
  development: {
    dialect: "sqlite",
    storage: process.env.DATABASE_STORAGE ?? "./src/database/database.local.sqlite",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    dialect: "sqlite",
    storage: process.env.DATABASE_STORAGE ?? "./src/database/database.sqlite",
  },
};
