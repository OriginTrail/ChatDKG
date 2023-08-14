import {
  getEmbeddings,
  getAnswerFromContext,
  search,
} from "./vertex-ai-helper.js";

(async () => {
  const question = "Can children take yewmakerol ?";

  // Get embeddings for the user's question
  const [embeddings] = await getEmbeddings([question]);

  // Find nearest neighbors
  const response = await search(embeddings);

  console.log(`Top 3 similarity search results:\n\n ${response}`);

  // Concatenate the search results into a single context string
  const context = response
    .map((result) => {
      return result.body;
    })
    .join("\n\n");

  // get answer from LLM
  const answer = await getAnswerFromContext(context, question);

  console.log(`Answer from LLM:\n\n ${answer}`);
})();
