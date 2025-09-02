const knex = require("../../config/knexConfig");

module.exports = {
  checkEmail: async (email) => {
    const result = await knex("tbl_login_account")
      .select("account_id", "password")
      .where("email", email)
      .first();
    return result ?? [];
  },
  getUser: async (account_id) => {
    const result = await knex
      .select(
        "user.title",
        "user.first_name",
        "user.last_name",
        "login.email",
        "user.user_id",
        "login.access_level"
      )
      .from({ user: "tbl_user_account" })
      .leftJoin(
        { login: "tbl_login_account" },
        "user.account_id",
        "login.account_id"
      )
      .where("user.account_id", account_id)
      .first();

    return result ?? [];
  },
};
