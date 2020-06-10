// Require the module
const iCloud = require('apple-icloud');
var prompt = require('prompt');


// Handles the requirement of two-factor-authentication
async function readyHandlerTwoFactor(myCloud) {
  if (myCloud.twoFactorAuthenticationIsRequired) {
    prompt.get(["Security Code"], function (err, input) {
      if (err) return console.error(err);
      const code = input["Security Code"];
      myCloud.securityCode = code;
    });
    return false;
  }
  else {
    console.log("You are logged in successfully!");

    return true;
  }

}

const sessionPath = "../tmp/icloud-session.json";

module.exports = async function login() {
  return new Promise(function (resolve, reject) {
    prompt.start();

    prompt.get({
      properties: {
        username: {
          pattern: /^.*$/,
          message: 'Mail',
          required: false
        },
        password: {
          required: false,
          hidden: true
        }
      }
    }, function (err, input) {
      if (err) return console.error(err);

      // This creates your iCloud instance
      var myCloud = new iCloud(sessionPath,input.username, input.password);

      myCloud.on("ready", async function () {

        const isAutheticated = await readyHandlerTwoFactor(myCloud);
        if (isAutheticated) {
          console.log(myCloud.account)
          resolve(myCloud);
        }

      });

      myCloud.on("sessionUpdate", function () {
        myCloud.saveSession();
      });
    });

  });
}