# This is a simple example of creating a Knowledge Asset from a JSON file on OriginTrail DKG
import os
import pandas as pd
import json
import langchain
import time
import js2py
from dkg import DKG
from dkg.providers import BlockchainProvider, NodeHTTPProvider
from dotenv import load_dotenv
from langchain.document_loaders import DataFrameLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Milvus

load_dotenv()

# Load the content of the Knowledge Asset (using an imaginary medicine "Yewmakerol" leaflet as content)

yewmakerol = json.load(open('../utils/yewmakerol.json'))

node_provider = NodeHTTPProvider(
        os.getenv("OT_NODE_HOSTNAME")
    )
blockchain_provider = BlockchainProvider(
        os.getenv("RPC_ENDPOINT"), 
        os.getenv("WALLET_PRIVATE_KEY")
    )

# initialize the DKG client on OriginTrail DKG
dkg = DKG(node_provider, blockchain_provider)

# NOTE: If you are trying to create asset on tesntet network, you will need OTP and TRAC testnet tokens for the next operation. You can get them on the OriginTrail Discord token faucet, as explained here: 
# https://docs.origintrail.io/decentralized-knowledge-graph-layer-2/testnet-node-setup-instructions/fund-your-v6-testnet-node

createAssetResult: any = dkg.asset.create({"public": yewmakerol}, 5)

print("Knowledge asset UAL: " + createAssetResult["UAL"])

# Read yewmakerol.json
with open("../utils/yewmakerol.json", "r") as file:
    yewmakerol = json.load(file)

tsvData = []
ual = createAssetResult["UAL"]
id_value = yewmakerol["@id"]

for section in yewmakerol["sections"]:
    sectionTitle = section["title"]
    for subsection in section["subsections"]:
        subsectionTitle = subsection.get("title")

        # Sanitize the body text here
        sanitizedBody = subsection["body"].replace("\n", "\\n").replace("\t", "\\t")

        if subsectionTitle:
            sanitizedBody = f"{subsectionTitle} {sanitizedBody}"

        if sectionTitle:
            sanitizedBody = f"{sectionTitle} {sanitizedBody}"

        tsvData.append({
            "ual": ual,
            "id": id_value,
            "sectionTitle": sectionTitle if sectionTitle else "undefined",
            "subsectionTitle": subsectionTitle if subsectionTitle else "undefined",
            "body": sanitizedBody,
        })

# Convert JSON objects to TSV
tsv = "\n".join("\t".join(str(val) for val in row.values()) for row in tsvData)

# Add headers
header = "\t".join(tsvData[0].keys())
tsvWithHeader = f"{header}\n{tsv}"

# Write to output.tsv
with open("output.tsv", "w") as output_file:
    output_file.write(tsvWithHeader)


# with this Python script we are loading all Knowledge Asset vector embeddings into Milvus VectorDB

df = pd.read_csv("./output.tsv", sep="\t")
loader = DataFrameLoader(df, "body")
docs = loader.load()

vector_db = Milvus(
    collection_name="OfficeHoursDemoCollection",
    embedding_function=HuggingFaceEmbeddings(model_name="multi-qa-MiniLM-L6-cos-v1"),
    connection_args={
        "uri": os.getenv("MILVUS_URI"),
        "user": os.getenv("MILVUS_USER"),
        "password": os.getenv("MILVUS_PASSWORD"),
        "secure": True,
    },
)

vector_db.add_documents(docs)
