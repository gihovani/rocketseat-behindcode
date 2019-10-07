class Session {
  get rules() {
    return {
      // validation rules
      email: 'email|required',
      password: 'required',
    };
  }
}

module.exports = Session;
