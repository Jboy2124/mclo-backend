const { StatusCodes } = require("http-status-codes");
const knex = require("../../config/knexConfig");
module.exports = {
  addNewUserAccount: async (account) => {
    const [account_id] = await knex("tbl_user_account").insert({
      user_id: account.user_id,
      title: account.title,
      first_name: account.first_name,
      last_name: account.last_name,
      suffix: account.suffix,
      designation: account.designation,
      status: "Inactive",
    });
    return account_id;
  },
  addNewLoginAccount: async (login) => {
    const [login_id] = await knex("tbl_login_account").insert({
      account_id: login.account_id,
      email: login.email,
      password: login.password,
    });
    return login_id;
  },
  updateAccountStatus: async (user) => {
    const result = await knex("tbl_user_account")
      .update({
        status: "Active",
      })
      .where("account_id", user);

    return { status: "SUCCESS" };
  },
  getOTP: async (otp) => {
    const result = await knex("tbl_one_time_pin")
      .select("user_id")
      .where("pin", otp)
      .andWhere("status", "Active")
      .first();
    return result;
  },
  updateOTP: async (otp) => {
    const result = await knex("tbl_one_time_pin")
      .update({ status: "Inactive" })
      .where("pin", otp);
    return result;
  },
};
