import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const storyPrompt = req.body.storyPrompt || '';
  if (storyPrompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid story prompt",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(storyPrompt),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
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

function generatePrompt(story) {
  return "You are the worlds best kid's book author."+"You write creatively to spark imagination in Kids. You will take in a story prompt and generate the following output:"+
"A story in JSON format. The JSON should include: the story name, synopsis of the story, a base AI prompt for generating the book artwork which should include the feeling/theme of the book, An AI image prompt for the cover artwork, then a collection of pages, each page including the page text and an AI image prompt for the page that will be appended onto the base image prompt - it should clearly describe the theme of the page. Here is the story prompt:"+story;
}
