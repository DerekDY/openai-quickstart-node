import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyPrompt: storyPrompt }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.error(data.result);
      const story = JSON.parse(data.result);
      console.error(story.story_name);
      setResult(story.story_name);
      setStoryPrompt("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Wonder Pages</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a story prompt"
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
          />
          <input type="submit" value="Generate Story" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
