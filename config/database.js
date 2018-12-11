require("dotenv").config();
module.exports = {
  database: `mongodb://${process.env.DB_USER}:${
    process.env.DB_PASS
  }@ds125693.mlab.com:25693/e-commerce`
};
