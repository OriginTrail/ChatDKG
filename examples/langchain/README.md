# ChatDKG Project README

This example walks you through the process of creating a knowledge asset on the Origintrail decentralized knowledge graph and searching the knowledge asset using the power of Langchain and OpenAI.

## Pre-requisites

- NodeJS v16 or higher.
- Python 3.10 or higher.
- An account on [Milvus](https://cloud.zilliz.com/orgs).

## Installation

Clone the repository:

```bash
git clone https://github.com/Origintrail/ChatDKG
cd ChatDKG
```

## NodeJS Dependencies

First, let's install the NodeJS dependencies:

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

## Create an Asset

Start by running the dkg-demo.js script:

```bash
node dkg-demo.js
```

The console will print a UAL, copy that for the next step.
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