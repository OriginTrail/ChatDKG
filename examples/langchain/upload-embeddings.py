# with this Python script we are loading all Knowledge Asset vector embeddings into Milvus VectorDB

import os
import pandas as pd
import langchain
from dotenv import load_dotenv
from langchain.document_loaders import DataFrameLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Milvus

load_dotenv()

df = pd.read_csv("../utils/output.tsv", sep="\t")
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
