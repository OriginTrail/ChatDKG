import "dotenv/config";
import DKG from "dkg.js";
import fs from "fs";

const yewmakerol = JSON.parse(fs.readFileSync("./yewmakerol.json"));

const dkg = new DKG({
  endpoint: process.env.OT_NODE_HOSTNAME,
  blockchain: {
    name: "otp::testnet",
    publicKey: process.env.WALLET_PUBLIC_KEY,
    privateKey: process.env.WALLET_PRIVATE_KEY,
  },
});

(async () => {
    const creationResult = await dkg.asset.create(yewmakerol, { epochsNum: 5 });

    console.log(`Knowledge asset UAL: ${creationResult.UAL}`);
})();
