const knex = require("../../config/knexConfig");

module.exports = {
  addNewOTP: async (otp, user) => {
    const [otp_id] = await knex("tbl_one_time_pin").insert({
      pin: otp,
      user_id: user,
      expires_at: "",
    });

    return otp_id;
  },
};
