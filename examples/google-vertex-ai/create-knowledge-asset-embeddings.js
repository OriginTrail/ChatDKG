// Import necessary libraries and modules
import "dotenv/config";
import DKG from "dkg.js";
import fs from "fs";
import { getEmbeddings } from "./helpers/vertex-ai-helper.js";

// Load the content of a medical Knowledge Asset, in this case, the "Yewmakerol" leaflet
const yewmakerol = JSON.parse(fs.readFileSync("../utils/yewmakerol.json"));

// Initialize the DKG client for the OriginTrail Decentralized Knowledge Graph on its Testnet
const dkg = new DKG({
  endpoint: process.env.OT_NODE_HOSTNAME,
  blockchain: {
    name: "otp::testnet",
    publicKey: process.env.WALLET_PUBLIC_KEY,
    privateKey: process.env.WALLET_PRIVATE_KEY,
  },
});

// Important: For creating an asset on the testnet, ensure you have OTP and TRAC testnet tokens.
// You can acquire them via the OriginTrail Discord token faucet. More info in the documentation link provided.
(async () => {
  // Create a new Knowledge Asset on the OriginTrail DKG platform
  const creationResult = await dkg.asset.create(yewmakerol, { epochsNum: 5 });
  const { UAL } = creationResult.UAL;

  console.log(`Knowledge asset UAL: ${UAL}`);

  const data = [];
  const id = yewmakerol["@id"];
  // Process the sections and subsections of the Knowledge Asset, preparing the data structure
  for (const section of yewmakerol.sections) {
    for (const subsection of section.subsections) {
      // Append the processed entry to the data array
      data.push({
        ual:UAL,
        id,
        sectionTitle: section.title,
        subsectionTitle: subsection.title,
        body: subsection.body,
      });
    }
  }

  const allEmbeddings = {};

  // Generate embeddings for the data in batches (5 entries at a time)
  for (let i = 0; i < data.length; i += 5) {
    const batch = data.slice(i, i + 5);
    const batchEmbeddings = await getEmbeddings(batch.map((item) => item.body));

    // Store each embedding with its corresponding metadata
    for (let j = 0; j < batchEmbeddings.length; j++) {
      allEmbeddings[i * 5 + j] = {
        metadata: batch[j],
        embedding: batchEmbeddings[j],
      };
    }
  }

  // Serialize and write the embeddings along with metadata to a JSON file
  fs.writeFileSync(
    "./embeddings-and-metadata-map.json",
    JSON.stringify(allEmbeddings, null, 2)
  );
})();
