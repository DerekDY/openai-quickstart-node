import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation, Pagination, Virtual 
} from "swiper/core";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Pagination, Virtual]);

export default function Home() {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [result, setResult] = useState();
  const [story, setStory] = useState();
  const [loadingMessage, setLoadingMessage] = useState();
  const [pages, setPages] = useState([]);
  const loadingURL= "https://openai-labs-public-images-prod.azureedge.net/user-xgOH8FUugNBrOHlG6898OQEe/generations/generation-Aay0x7H5jn4OtSTZ7kSHGbhn/image.png"

  async function onSubmit(event) {
    const isDebug=false;
    setLoadingMessage("Just a second! Getting Creative!");
    setPages([]);
    event.preventDefault();
    try {
      var story = {};
      
      if (isDebug){
        story = {
          story_name: "The Test",
          cover_art_prompt: "A young girl with curly...",
          pages: [
          {
            page_text: "Lily sat nervously at her desk, staring at the blank test in front of her",
            page_art_prompt: "Lily sitting at her dest with a wordied.."
          },
          {
            page_text: "taking a deep breath she passed the test!",
            page_art_prompt: "Lily sitting at her dest with a wordied.."
          }
        ]
      };
      var image = "https://openai-labs-public-images-prod.azureedge.net/user-xgOH8FUugNBrOHlG6898OQEe/generations/generation-Aay0x7H5jn4OtSTZ7kSHGbhn/image.png";
     }else {
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
        story = await JSON.parse(data.result);
      }
      console.error(story); 
      console.error(story.story_name);
      var cover_prompt=story.cover_art_prompt;
      var style=story.illustration_style;
      console.error(cover_prompt);
      setResult(story.story_name);
      setStory(story);
      setStoryPrompt("");
      
      console.error("Getting Cover Art!")
      
      if (!isDebug) image = await requestImage(cover_prompt + "Illustration Style: "+style);
      var coverURL = image;
      story.cover_url = coverURL;
      setStory(story);
      setLoadingMessage(null);
      const slides = [];
      
      slides.push(
        <SwiperSlide>
			<div>
			  {story && story.cover_url && (<img src={story.cover_url} style={{ width: '100%' }}></img>)}
			</div>
        	<div className={styles.result}>{story.story_name}</div>
		</SwiperSlide>
      );
     
      if (story && story.pages) {
        for (let i = 0; i < story.pages.length; i++) {
          const currentPage = story.pages[i];
          console.error(currentPage.page_art_prompt+"Illustration Style: "+style);
          if (!isDebug) image= await requestImage(currentPage.page_art_prompt+"Illustration Style: "+style)
          // Do something with currentPage
          currentPage.page_url = image;
          slides.push(
            <SwiperSlide>
				<div>{currentPage.page_url && (<img src={currentPage.page_url} style={{ width: '100%' }}></img>)}</div>
				<div>{currentPage.page_text}</div>
			</SwiperSlide>
          );
        }
      }
      setLoadingMessage(null);
      setPages(slides);
      console.error(story); 
      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    //console.error(story.illustration_style);
    
  }
  
  async function requestImage(prompt){
    console.error("in the request function");
    try {
      const response = await fetch("/api/illustrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagePrompt: prompt }),
      });
      
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.error(data.result);
      return data.result;
    }catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      return "";
    }
  }

  return (
    <div>
      <Head>
        <title>Wonder Pages</title>
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
        {!!loadingMessage && (<img src="https://openai-labs-public-images-prod.azureedge.net/user-xgOH8FUugNBrOHlG6898OQEe/generations/generation-Aay0x7H5jn4OtSTZ7kSHGbhn/image.png" style={{ width: '100%' }}></img>)}
		
		<swiper
		    id="swiper"
		    virtual
			navigation
			pagination
			slidesPerView={1}
		>
			{pages}
		</swiper>
      </main>
    </div>
  );
}
