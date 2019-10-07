class ForgotPassword {
  get rules() {
    return {
      // validation rules
      email: 'email|required',
    };
  }
}

module.exports = ForgotPassword;
