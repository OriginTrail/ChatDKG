# ChatDKG Project README

This example shows a basic extractive question answering application built with OriginTrail Knowledge Assets and Langchain. 
It walks you through the process of creating a single Knowledge Asset on the OriginTrail Decentralized Knowledge Graph and necessary indexing operations to enable extractive question answering (EQA) using natural language based semantic search (such as in the form of asking a question) over the Knowledge Asset content using Langchain and Milvus Vector DB.

In contrast to generative QA systems such as ChatGPT, an extractive system doesn't "hallucinate", rather only extracts content from within the verifiable Knowledge Asset. 
Additionally, to extend the extractive approach, we also demonstrate an "extract & summarize" approach that takes the extracted content from the Knowledge Asset and submits it to an LLM (in this case OpenAI) to summarize.



## Pre-requisites

- NodeJS v16 or higher.
- Python 3.10 or higher.
- Access to an OriginTrail DKG node. You can setup your own by following instructions [here](https://docs.origintrail.io/decentralized-knowledge-graph-layer-2/testnet-node-setup-instructions/setup-instructions-dockerless)
- An account on [Milvus](https://cloud.zilliz.com/orgs).
- Optionally: OpenAI API key

## Installation

Clone the repository:

```bash
git clone https://github.com/Origintrail/ChatDKG
cd ChatDKG
```

## NodeJS Dependencies

First install the NodeJS dependencies:

```bash
npm install
```

## Python Dependencies

Then, install Python dependencies:

```bash
pip install dotenv openai langchain pandas
```
## Environment Variables

You'll need to setup your environment variables. Copy the .env.example to a new .env file:

```bash
cp .env.example .env
```

Open the .env file and replace the placeholders with your actual values. The file should look like this:

```makefile
OT_NODE_HOSTNAME=<Your OT Node Hostname>
WALLET_PUBLIC_KEY=<Your Wallet Public Key>
WALLET_PRIVATE_KEY=<Your Wallet Private Key>
MILVUS_URI=<Your Milvus URI>
MILVUS_USER=<Your Milvus User>
MILVUS_PASSWORD=<Your Milvus Password>
OPENAI_API_KEY=<Your OpenAI API Key>
```

# Usage

## Create a Knowledge Asset

Start by running the dkg-demo.js script:

```bash
node dkg-demo.js
```

The console will print a Uniform Asset Locator (UAL), copy that for the next step.
## Generate TSV

Next, run the generate-tsv.js script with the UAL as an argument:

```bash
node generate-tsv.js <UAL>
```

This will generate a file named output.tsv.

## Upload Embeddings

Make sure your Milvus account details are set up in the .env file. Then run the upload-embeddings.py script:

```bash
python upload-embeddings.py
```

This script reads the TSV file, generates embeddings and uploads them to your Milvus account.

## Search in the Knowledge Graph

Now you can run the search.py script:

```bash
python search.py
```

This will generate responses based on the uploaded knowledge graph.

## Troubleshooting

If you encounter any issues, please check that you've correctly set all environment variables in the .env file and that you have the right versions of NodeJS and Python. If you continue to experience problems, please open an issue in the GitHub repository.
