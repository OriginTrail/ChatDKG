# ChatDKG example - Extractive question answering with OriginTrail and Google Vertex AI

Hello there! This example will show you how to create a basic Extractive question answering system using OriginTrail Knowledge Assets and the Google Vertex AI. Before running the code, we have to create an index with the Vertex AI Matching Engine and deploy a public endpoint that we will query.

With this example you will:

- create an OriginTrail Knowledge Asset from a JSON object, using the DKG JS client
- create index entries from that Knowledge Asset and upload them to a Vertex AI index
- execute similarity search over the index via a public endpoint and discover the source Knowledge Assets
- use Google Chirp speech recognition model to transcribe audio files

In contrast to generative QA systems such as ChatGPT, an extractive system doesn't "hallucinate", rather only extracts content from within the verifiable Knowledge Asset.
Additionally, to extend the extractive approach, we also demonstrate an "extract & summarize" approach that takes the extracted content from the Knowledge Asset and submits it to an LLM (in this case Vertex AI Prediction Service) to summarize.

## Pre-requisites

- NodeJS 16
- Access to an OriginTrail DKG node. You can setup your own by following instructions [here](https://docs.origintrail.io/decentralized-knowledge-graph-layer-2/testnet-node-setup-instructions/setup-instructions-dockerless)
- An account and a project set up on [Google Vertex AI](https://cloud.google.com/vertex-ai).
- Optionally: OpenAI API key

## Installation

Clone the repository:

```bash
git clone https://github.com/Origintrail/ChatDKG
cd ChatDKG
```

## NodeJS Dependencies

First install NodeJS dependencies:

```bash
npm install
```

## Environment Variables

You'll need to setup your environment variables. Copy the .env.example to a new .env file:

```bash
cd examples/google-vertex-ai
cp .env.example .env
```

Open the .env file and replace the placeholders with your actual values. The file should look like this:

```makefile
OT_NODE_HOSTNAME=<Your OT Node Hostname>
WALLET_PUBLIC_KEY=<Your Wallet Public Key>
WALLET_PRIVATE_KEY=<Your Wallet Private Key>

GOOGLE_PROJECT_NUMBER=<Your Google Project Number>
GOOGLE_PROJECT_ID=<Your Google Project ID>
GOOGLE_API_ENDPOINT=<Your Google API Endpoint>
GOOGLE_INDEX_ENDPOINT=<Your Google Matching Engine Endpoint>
GOOGLE_DEPLOYED_INDEX_ID=<Your Google Matching Engine Deployed Index ID>
GOOGLE_AUTH_TOKEN=<Your Google Auth Token>
```

# Usage

create an index - notebook
create a public endpoint
query it with the code

## Create a Knowledge Asset

Start by running the `create-knowledge-asset-embeddings.js` script:

```bash
node create-knowledge-asset-embeddings.js
```

The script will create a knowledge asset on DKG, print a Uniform Asset Locator (UAL), generate and create a JSON files with the metadata and the embeddings. This file should later be uploaded to a Google Cloud Bucket and used for creating the index which is explained in the Python notebook attached.

## Create a Vertex AI index

Import the MatchingEngine.ipynb notebook into [Google Colab](https://colab.google/) and follow the steps to deploy your index. Make sure to replace the demo project information with your own project id, location etc.

## Create a Vertex AI public index endpoint

Using the index's ID from the previous step which you can access on the [Vertex AI Interface](https://console.cloud.google.com/vertex-ai/matching-engine/) follow the guide from the official docs to retrieve a public endpoint which is required in the .env file.

## (Optional) Integrate speech recognition

Use getSpeechTranscript function from the vertex-ai-helper.js file to create a transcript for an audio file. You should add an audio file to this directory and pass the file's relative path to the function.

## Search in the Knowledge Graph

Now you can run the search.js script:

```bash
node search.js
```

This will generate responses based on the uploaded knowledge graph.

## Troubleshooting

If you encounter any issues, please check that you've correctly set all environment variables in the .env file and that you have the right version Python. If you continue to experience problems, please open an issue in the GitHub repository.
