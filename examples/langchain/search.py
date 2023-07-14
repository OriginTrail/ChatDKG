import os
import json
from dotenv import load_dotenv

import openai
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Milvus

load_dotenv()


# LANGCHAIN API
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


question = "Can I take Yewmakerol if i'm pregnant ?"
docs = vector_db.similarity_search(question)

all_documents = []

for doc in docs:
    document_dict = {
        'page_content': doc.page_content,
        'metadata:': {
            **doc.metadata
        }
    }
    all_documents.append(document_dict)

print("EXTRACTED RESPONSES: \n")
print(json.dumps(all_documents, indent=4))


# OPENAI API

openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system", 
            "content": f"You receive a question and some JSON, and you answer the question based on the information found in the JSON. You do not mention the JSON in the response, but just produce an answer"
        },
        {
            "role": "user", 
            "content": f"Answer the question: {question} based on the following json: {json.dumps(all_documents)}",},
    ],
)

print("\n\nEXTRACTED & SUMMARIZED RESPONSES: \n")
print(response['choices'][0]['message']['content'])