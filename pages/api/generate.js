import {Configuration, OpenAIApi} from "openai";

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
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are the worlds best kid's book author."},
        {"role": "user", "content": generatePrompt(storyPrompt)}
      ],
      temperature: 0.6,
      max_tokens: 1000
    });
    console.log(completion.data.choices[0].message);
    res.status(200).json({ result: completion.data.choices[0].message.content});
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
  return "You are the worlds best kid's book author. you write creatively to spark imagination in Kids. You will take in a story prompt and generate the following output in JSON format. {\"story_name\": {story title},\"synopsis\":{synopsis of the story},\"illustration_style\":{they style of the illustration for the story. examples: pencil art, pixar, watercolor, storybook, colored pencil, comic book, Bill Watterson},\"cover_art_prompt\":{ai prompt for the front cover illustration. Be very specific and descriptive but do not include words or names. Convey the age, gender, or discription of important characters. example: young blonde boy with a blue cape next to a brown dog overlooking the ocean.},\"pages\":[{\"page_text\":{page text},\"page_art_prompt\":{ai prompt to generate the illustration for the page. Be very descriptive and do not assume that the AI has context from the previous page, DO NOT INCLUDE CHARACTER NAMES. Convey the age, gender, or discription of important characters.example: young blonde boy with a red hat next to a fridge that is open}},{continue for each page}]} Here is the stroy prompt: "+story+"/n/n the json object:";
}
