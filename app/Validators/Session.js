const Antl = use('Antl');

class Session {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      // validation rules
      email: 'email|required',
      password: 'required',
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Session;
