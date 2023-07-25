# ChatDKG example - Extractive question answering with OriginTrail and Milvus

Hello there! This example will show you how to create a basic Extractive question answering system using OriginTrail Knowledge Assets and the open source Milvus Vector Database. To easily deploy the example, we will be using the hosted Milvus instance by the Zilliz platform.

With this example you will:
- create an OriginTrail Knowledge Asset from a JSON object, using the DKG Python client
- create VectorDB index entries from that Knowledge Asset
- Execute VectorDB similarity search over the index and discover the source Knowledge Assets
 
In contrast to generative QA systems such as ChatGPT, an extractive system doesn't "hallucinate", rather only extracts content from within the verifiable Knowledge Asset. 
Additionally, to extend the extractive approach, we also demonstrate an "extract & summarize" approach that takes the extracted content from the Knowledge Asset and submits it to an LLM (in this case OpenAI) to summarize.

## Pre-requisites

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

## Python Dependencies

First install Python dependencies:

```bash
pip install python-dotenv openai langchain pandas js2py git+https://github.com/OriginTrail/dkg.py.git
```
## Environment Variables

You'll need to setup your environment variables. Copy the .env.example to a new .env file:

```bash
cd examples/milvus
cp .env.example .env
```

Open the .env file and replace the placeholders with your actual values. The file should look like this:

```makefile
OT_NODE_HOSTNAME=<Your OT Node Hostname>
RPC_ENDPOINT=<blockchain rpc endpoint>
WALLET_PUBLIC_KEY=<Your Wallet Public Key>
WALLET_PRIVATE_KEY=<Your Wallet Private Key>
MILVUS_URI=<Your Milvus URI>
MILVUS_USER=<Your Milvus User>
MILVUS_PASSWORD=<Your Milvus Password>
OPENAI_API_KEY=<Your OpenAI API Key>
TOKENIZERS_PARALLELISM=false
```

# Usage

## Create a Knowledge Asset 

Start by running the `create-demo-knowledge-assets.py` script:

```bash
python3 create-demo-knowledge-assets.py
```

The script will create a knowledge asset on DKG, print a Uniform Asset Locator (UAL), generate and upload embeddings to your Milvus account. Make sure your Milvus account details are set up in the .env file. 

## Search in the Knowledge Graph

Now you can run the search.py script:

```bash
python search.py
```

This will generate responses based on the uploaded knowledge graph.

## Troubleshooting

If you encounter any issues, please check that you've correctly set all environment variables in the .env file and that you have the right version Python. If you continue to experience problems, please open an issue in the GitHub repository.
