const { isNullOrEmptyOrUndefined } = require("../../utilities/functions");
const { verifyPassword } = require("../../utilities/utilities");
const { getTitle } = require("../services/codes");
const { checkEmail, getUser } = require("../services/login");

module.exports = {
  login: async (payload) => {
    const { email } = payload;
    try {
      let isValid = false;
      const result = await checkEmail(email);
      if (!isNullOrEmptyOrUndefined(result)) {
        const { password, account_id } = result;
        const isMatch = await verifyPassword(password, payload.password);
        if (isMatch) {
          const user = await getUser(account_id);
          return {
            isValid: true,
            result: {
              fname: user?.first_name,
              lname: user?.last_name,
              email: user?.email,
              userId: user?.user_id,
              accessLevel: user?.access_level,
            },
          };
        }
        return isValid;
      }
      return isValid;
    } catch (err) {}
  },
};
