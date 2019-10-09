/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

class SubscriptionController {
  async store({ params, auth, response }) {
    const user = await auth.getUser();
    const workshop = await Workshop.findByOrFail('id', params.workshop_id);

    const userSubscriptions = await user
      .subscriptions()
      .where('section', workshop.section)
      .first();

    if (userSubscriptions) {
      return response.status(400).send({
        error: 'You cannot subscribe to two workshops in the same sections',
      });
    }

    const count = await workshop.subscriptions().count('* as total');
    if (count[0].total >= 48) {
      return response.status(400).send({
        error: 'Workshop is sould out',
      });
    }

    await workshop.subscriptions().attach(user.id);

    return response.status(201).send();
  }

  async destroy({ params, auth }) {
    const user = await auth.getUser();
    const workshop = await Workshop.findByOrFail('id', params.workshop_id);

    await workshop.subscriptions().detach(user.id);
  }
}

module.exports = SubscriptionController;
