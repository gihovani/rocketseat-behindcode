const { test, trait } = use('Test/Suite')('Workshop');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/workshops')
    .loginVia(user, 'jwt')
    .send({
      title: 'Título do workshop',
      description:
        'Workshop é uma reunião de um grupo de pessoas interessadas em um determinado assunto. Pode ser também uma atividade para discussão sobre um tema que é de interesse para todos.',
      user_id: user.id,
      section: 1,
    })
    .end();

  response.assertStatus(201);
  assert.exists(response.body.id);
});

test('it should be able to list workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create({
    user_id: user.id,
  });

  const response = await client
    .get('/workshops')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body[0].title, workshop.title);
  assert.equal(response.body[0].user.id, user.id);
});

test('it should be able to show single workshop', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create({
    user_id: user.id,
  });

  const response = await client
    .get(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.title, workshop.title);
  assert.equal(response.body.user.id, user.id);
});

test('it should be able to update a workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create({
    user_id: user.id,
  });

  const newTitle = 'New Title!';
  const response = await client
    .put(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .send({
      ...workshop.toJSON(),
      title: newTitle,
    })
    .end();

  response.assertStatus(200);
  assert.equal(response.body.title, newTitle);
});

test('it should be able to delete a workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create({
    user_id: user.id,
  });

  const response = await client
    .delete(`/workshops/${workshop.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(204);

  const checkWorkshop = await Workshop.find(workshop.id);
  assert.isNull(checkWorkshop);
});
