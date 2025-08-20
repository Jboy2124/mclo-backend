module.exports = {
  isNullOrEmptyOrUndefined: (value) => {
    if (value === undefined || value.lenght === 0 || value === null) {
      return true;
    } else {
      return false;
    }
  },
};
