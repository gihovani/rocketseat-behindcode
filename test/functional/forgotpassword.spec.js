const { test, trait } = use("Test/Suite")("Forgot Password");

const Mail = use("Mail");
const Hash = use("Hash");
const { subHours, format } = require("date-fns");

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

trait("Test/ApiClient");
trait("DatabaseTransactions");

async function generateForgotPasswordToken(client, email) {
  return token;
}

test("it should send an email with forgot password instructions", async ({
  assert,
  client
}) => {
  Mail.fake();

  const email = "gihovani@gmail.com";
  const user = await Factory.model("App/Models/User").create({ email });

  await client
    .post("/forgot")
    .send({ email })
    .end();

  const token = await user.tokens().first();
  const recentEmail = Mail.pullRecent();
  assert.equal(recentEmail.message.to[0].address, email);

  assert.include(token.toJSON(), { type: "forgotpassword" });
  Mail.restore();
});

test("it should be able to reset password", async ({ assert, client }) => {
  const email = "gihovani@gmail.com";
  const user = await Factory.model("App/Models/User").create({ email });
  const { token } = await Factory.model("App/Models/Token").create({
    user_id: user.id,
    type: "forgotpassword"
  });

  await client
    .post("/reset")
    .send({ token, password: "123456", password_confirmation: "123456" })
    .end();

  await user.reload();
  const checkPassword = await Hash.verify("123456", user.password);

  assert.isTrue(checkPassword);
});

test("it cannot reset password after 2h of forgot password request", async ({
  client
}) => {
  const email = "gihovani@gmail.com";
  const user = await Factory.model("App/Models/User").create({ email });
  const token = await Factory.model("App/Models/Token").create({
    user_id: user.id,
    type: "forgotpassword"
  });
  token.created_at = format(subHours(new Date(), 5), "yyyy-MM-dd HH:ii:ss");
  token.save();

  const response = await client
    .post("/reset")
    .send({ token, password: "123456", password_confirmation: "123456" })
    .end();

  response.assertStatus(400);
});
