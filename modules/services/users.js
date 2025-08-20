const knex = require("../../config/knexConfig");

module.exports = {
  getAllusers: async (status) => {
    const result = await knex
      .select({
        accountId: "account_id",
        userId: "user_id",
        title: "title",
        fname: "first_name",
        lname: "last_name",
        designation: "designation",
      })
      .from({ user: "tbl_user_account" })
      .where("user.status", status);

    return result;
  },
};
