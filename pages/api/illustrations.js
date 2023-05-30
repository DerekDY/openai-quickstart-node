import {OpenAIApi, Configuration} from "openai";
const configuration = new Configuration(
  {apiKey: process.env.OPENAI_API_KEY}
);
const openai= new OpenAIApi(configuration);

export default async function(req,res){
  if(!configuration.apiKey){
    res.status(500).json(
      {error:{ message: "key not configured"}}
    );
    return;
  }
  const imagePrompt=req.body.imagePrompt;
  try{
    console.log(imagePrompt);
    const completion = await openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: "512x512",
    });
    console.log(completion.data);
    res.status(200).json({ result: completion.data.data[0].url});
  }catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
 