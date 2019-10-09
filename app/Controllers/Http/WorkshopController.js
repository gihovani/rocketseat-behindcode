/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

class WorkshopController {
  async index({ request }) {
    const section = request.input('section', 1);

    const workshops = await Workshop.query()
      .where('section', section)
      .with('user', builder => {
        builder.select(['id', 'name', 'title', 'avatar']);
      })
      .fetch();

    return workshops;
  }

  async store({ request, response }) {
    const data = request.only([
      'color',
      'title',
      'description',
      'user_id',
      'section',
    ]);
    const workshop = await Workshop.create(data);

    return response.status(201).json(workshop);
  }

  async show({ params }) {
    const workshop = await Workshop.findByOrFail('id', params.id);
    await workshop.load('user', builder => {
      builder.select(['id', 'name', 'avatar', 'title', 'github', 'linkedin']);
    });

    return workshop;
  }

  async update({ request, params, response }) {
    const data = request.only([
      'color',
      'title',
      'description',
      'user_id',
      'section',
    ]);
    const workshop = await Workshop.findByOrFail('id', params.id);

    workshop.merge(data);

    await workshop.save();

    return response.json(workshop);
  }

  async destroy({ params }) {
    const workshop = await Workshop.findByOrFail('id', params.id);

    await workshop.delete();
  }
}

module.exports = WorkshopController;
