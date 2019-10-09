const { test, trait } = use('Test/Suite')('Subscription');
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Hash = use('Hash');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('user should be able to subscribe to workshops', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  const response = await client
    .post(`/workshops/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(201);

  const subscriptionWorkshop = await user.subscriptions().first();
  assert.equal(subscriptionWorkshop.id, workshop.id);
});

test('user should not be able to subscribe to workshops in the same section', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop1 = await Factory.model('App/Models/Workshop').create({
    section: 1,
  });
  await workshop1.subscriptions().attach(user.id);

  const workshop2 = await Factory.model('App/Models/Workshop').create({
    section: 1,
  });

  const response = await client
    .post(`/workshops/${workshop2.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  const subscriptions = await user.subscriptions().count('* as total');
  assert.equal(subscriptions[0].total, 1);
});

test('workshop can only receive 48 subscriptions', async ({
  assert,
  client,
}) => {
  const oldHashMake = Hash.make;
  Hash.make = () => '12345';
  const users = await Factory.model('App/Models/User').createMany(48);
  Hash.make = oldHashMake;

  const workshop = await Factory.model('App/Models/Workshop').create();
  const usersId = users.map(user => user.id);
  await workshop.subscriptions().attach(usersId);

  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post(`/workshops/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  const subscriptions = await workshop.subscriptions().count('* as total');
  assert.equal(subscriptions[0].total, 48);
});

test('user should unsubscribe from a workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();
  await user.subscriptions().attach(workshop.id);

  const response = await client
    .delete(`/workshops/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);

  const subscriptionWorkshop = await user.subscriptions().first();
  assert.isNull(subscriptionWorkshop);
});
