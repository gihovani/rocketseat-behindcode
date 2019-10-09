/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Workshop extends Model {
  user() {
    return this.belongsTo('App/Models/User');
  }

  getSection(section) {
    return Number(section);
  }

  subscriptions() {
    return this.belongsToMany('App/Models/User')
      .pivotTable('subscriptions')
      .withTimestamps();
  }
}

module.exports = Workshop;
