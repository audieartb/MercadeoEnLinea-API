const mailchimpTx = require("@mailchimp/mailchimp_transactional")("9cmhV2NBJI86-ebH5ZF3uA");

async function run() {
  const response = await mailchimpTx.users.ping();
}

run();