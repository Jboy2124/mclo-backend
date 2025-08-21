const knex = require("../../config/knexConfig");

module.exports = {
  getAllusers: async (status) => {
    const result = await knex
      .select({
        accountId: "user.account_id",
        userId: "user.user_id",
        title: "user.title",
        fname: "user.first_name",
        lname: "user.last_name",
        email: "login.email",
        designation: "user.designation",
      })
      .from({ user: "tbl_user_account" })
      .leftJoin(
        { login: "tbl_login_account" },
        "user.account_id",
        "login.account_id"
      )
      .where("user.status", status);

    return result;
  },
};
