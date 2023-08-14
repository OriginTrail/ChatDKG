// Required modules and packages
import axios from "axios";
import fs from "fs";
import aiplatform from "@google-cloud/aiplatform";
import { SpeechClient } from "@google-cloud/speech/build/src/v2/index.js";
import pkg from "@google-cloud/speech/build/protos/protos.js";
import "dotenv/config";

// Loading embedding and metadata mapping
const metadataMap = JSON.parse(
  fs.readFileSync("./embeddings-and-metadata-map.json")
);

// Various clients and helpers setup
const { PredictionServiceClient } = aiplatform.v1;
const { helpers } = aiplatform;
const { google } = pkg;

// Configuration options for AI Platform
const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
};

// Configuration options for Google Cloud Speech
const speechClientOptions = {
  apiEndpoint: "us-central1-speech.googleapis.com",
  keyFilename: "./key.json",
  projectId: "vertex-ka",
};

// Constant model and endpoint details
const modelEmbedding = "textembedding-gecko@001";
const modelAnswer = "text-bison@001";

// Environment variables for Google Cloud configuration
const apiEndpoint = process.env.GOOGLE_API_ENDPOINT;
const projectNumber = process.env.GOOGLE_PROJECT_NUMBER;
const indexEndpoint = process.env.GOOGLE_INDEX_ENDPOINT;
const token = process.env.GOOGLE_AUTH_TOKEN;
const deployedIndexId = process.env.GOOGLE_DEPLOYED_INDEX_ID;

const location = "europe-west1";
const publisher = "google";
const limit = 3;

// Default parameters for the prediction service
const DEFAULT_PARAMS = {
  temperature: 0,
  maxOutputTokens: 1000,
  topP: 0,
  topK: 1,
};

// Instantiate Prediction and Speech clients
const predictionServiceClient = new PredictionServiceClient(clientOptions);
const speechClient = new SpeechClient(speechClientOptions);

// Function to get predictions from the specified model
async function predict(model, instances, params = DEFAULT_PARAMS) {
  const endpoint = `projects/${projectNumber}/locations/${location}/publishers/${publisher}/models/${model}`;
  const parameters = helpers.toValue(params);
  const request = {
    endpoint,
    instances,
    parameters,
  };

  const [response] = await predictionServiceClient.predict(request);
  return response.predictions;
}

// Function to convert audio file to text using Google Cloud Speech API
export async function getSpeechTranscript(audioFile = "./uploads/audio.wav") {
  console.log("converting audio to text...");
  const audio = {
    content: fs.readFileSync(audioFile).toString("base64"),
  };
  const config = {
    autoDecodingConfig: new google.cloud.speech.v2.AutoDetectDecodingConfig(),
    enableAutomaticPunctuation: true,
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCodes: ["en-US"],
    model: "chirp",
  };
  const request = {
    content: audio.content,
    config: config,
    recognizer: `projects/vertex-ka/locations/us-central1/recognizers/_`,
  };
  try {
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    return transcription;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Function to get embeddings for the provided contents
export async function getEmbeddings(contents) {
  const instances = contents.map((content) => helpers.toValue({ content }));
  const predictions = await predict(modelEmbedding, instances);
  return predictions.map((prediction) => {
    const embeddingValues =
      prediction.structValue.fields.embeddings.structValue.fields.values
        .listValue.values;
    return embeddingValues.map((value) => value.numberValue);
  });
}

// Function to get answer from context using AI platform
export async function getAnswerFromContext(context, userQuestion) {
  console.log("getting answer from context...");
  const instanceContent = `Answer the question: ${userQuestion}, based only on the following text: ${context}. If you don't find an answer to the question in the text, answer with: "Information not found". Briefly explain your reasoning. Refer to the text as "leaflet"`;
  const instances = [helpers.toValue({ content: instanceContent })];
  const predictions = await predict(modelAnswer, instances);
  if (predictions && predictions.length > 0) {
    const answer = predictions[0]?.structValue?.fields?.content?.stringValue;
    if (!answer.length || answer.toLowerCase() === "information not found") {
      return "Sorry, I couldn't find an answer to your question in the provided data.";
    }
    return answer;
  } else {
    return "Sorry, I couldn't generate an answer for your question.";
  }
}

// Function to search for nearest neighbors based on vector
export async function search(vector) {
  console.log("finding nearest neighbors...");
  let response = await axios.post(
    `https://${apiEndpoint}/v1beta1/${indexEndpoint}:findNeighbors`,
    {
      deployed_index_id: deployedIndexId,
      queries: [
        {
          datapoint: {
            datapoint_id: "0",
            feature_vector: vector,
          },
          neighbor_count: limit,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response?.data?.nearestNeighbors?.[0]?.neighbors) return null;
  const ids = response.data.nearestNeighbors[0].neighbors.map(
    (x) => x.datapoint.datapointId
  );
  return ids.map((i) => metadataMap[i].metadata);
}

// Main function to extract and summarize information based on user's question
export async function extractAndSummarize(question, useLLM) {
  // Get embeddings for the user's question
  const [embeddings] = await getEmbeddings([question]);
  // Find nearest neighbors
  const response = await search(embeddings);
  if (!response?.length) {
    throw Error(
      "Sorry, I couldn't find relevant information for your question."
    );
  }
  let answer;
  if (useLLM) {
    // Concatenate the search results into a single context string
    const context = response
      .map((result) => {
        return result.body;
      })
      .join("\n\n");
    answer = await getAnswerFromContext(context, question);
  }
  return { extracted: response, summarized: answer };
}
