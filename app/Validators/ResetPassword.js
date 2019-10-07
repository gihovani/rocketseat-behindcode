class ResetPassword {
  get rules() {
    return {
      // validation rules
      token: 'required',
      password: 'required|confirmed',
    };
  }
}

module.exports = ResetPassword;
