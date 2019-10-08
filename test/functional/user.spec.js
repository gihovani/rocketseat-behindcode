const { test, trait } = use('Test/Suite')('User');
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Helpers = use('Helpers');
const Hash = use('Hash');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to update profile', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'gg2',
    password: '1234',
  });

  const newName = 'Jorgesss';
  const newPass = '123456';
  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .field('name', newName)
    .field('password', newPass)
    .field('password_confirmation', newPass)
    .attach('avatar', Helpers.tmpPath('test/avatar.png'))
    .end();

  response.assertStatus(200);
  assert.exists(response.body.avatar);
  assert.equal(response.body.name, newName);

  await user.reload();

  assert.isTrue(await Hash.verify(newPass, user.password));
});
