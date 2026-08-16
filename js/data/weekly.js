/* ============================================================
   WEEKLY BUILD — one genuinely cool, shareable thing per week.
   Different from AI Lab: those are 20-min taste tests, these are
   2-4 hour creative builds that produce something worth showing.
   Each is deliberately chosen so nobody else in your cohort has one.
   ============================================================ */

window.WEEKLY = [
{
  w: 1, title: "Narrated data story", time: "2-3 h",
  pitch: "Turn your first EDA into a 60-second narrated video. Most people post a screenshot of a chart; you post something that explains itself.",
  tools: ["Your EDA notebook", "ElevenLabs (free tier)", "Canva or Keynote", "Whisper (optional)"],
  steps: [
    "Take the 5 key findings from your day-7 EDA notebook",
    "Write a 150-word script — one sentence per finding, plain English, no jargon",
    "Generate the voiceover in ElevenLabs (free tier is plenty for 150 words)",
    "Put your 5 charts on 5 slides, export as video, lay the audio over it",
    "Add one sentence of on-screen text per chart so it works on mute"
  ],
  out: "A 60-second video explaining a real dataset.",
  share: "LinkedIn loves short video. Caption: the question you asked, the surprising thing you found, and what you'd do next. Not 'I completed day 7'.",
  why: "Communicating findings to non-technical people IS the job. This proves you can do it, not just that you can code."
},
{
  w: 2, title: "Gradient descent, animated", time: "2-3 h",
  pitch: "Animate an optimiser walking down a loss surface. This is the single most-shared type of ML visual, and you'll have built it from scratch.",
  tools: ["matplotlib", "numpy", "your day-11 optimiser code"],
  steps: [
    "Take your hand-written gradient descent from day 11",
    "Log the (w, b, loss) at every step into a list",
    "Plot the loss surface as a 3-D contour, then animate the path over it",
    "Do it three times: learning rate too small, just right, and diverging",
    "Export as a GIF with matplotlib.animation"
  ],
  out: "Three GIFs showing convergence, crawling, and divergence.",
  share: "Post the three side by side with the caption 'same model, three learning rates'. It teaches something in 3 seconds.",
  why: "You'll be asked 'what happens if the learning rate is too high'. You'll have the picture in your head AND a link."
},
{
  w: 3, title: "Explain your model as a comic", time: "2-3 h",
  pitch: "A 6-panel comic explaining how your classifier works, with AI-generated art. Ridiculous, memorable, and genuinely hard to do well.",
  tools: ["Midjourney / Flux / Ideogram", "Canva", "your day-21 model"],
  steps: [
    "Write 6 captions that explain your model end to end, one per panel",
    "Generate a consistent character across panels — this is the hard bit, use the same seed and style prompt",
    "Assemble in Canva with speech bubbles",
    "Keep the technical content correct; the art is the hook, not the substance"
  ],
  out: "A 6-panel comic explaining a real ML pipeline.",
  share: "This gets far more engagement than a code screenshot. Put the accurate technical explanation in the post body.",
  why: "Character consistency across generations teaches you real prompt control, and explaining simply proves you understand deeply."
},
{
  w: 4, title: "AI personas for your segments", time: "3-4 h",
  pitch: "Cluster real customers, then generate a face, a name and a day-in-the-life for each segment. Turns a scatter plot into something a marketing team could actually use.",
  tools: ["Your day-29 clustering", "an LLM", "Flux / Midjourney", "Canva"],
  steps: [
    "Run your RFM segmentation and profile each cluster numerically",
    "Feed each cluster's stats to an LLM and ask for a realistic persona — name, age, motivation, frustration",
    "Generate a portrait per persona with consistent style",
    "Build a one-page persona card per segment: photo, name, the real numbers, and one recommended action",
    "Sanity-check that the personas actually match the cluster statistics — do not let the LLM invent"
  ],
  out: "4-5 persona cards backed by real clustering.",
  share: "Post the cards plus the honest note that the faces are generated and the numbers are real.",
  why: "This is exactly what a growth or marketing analytics team produces. It shows you connect models to decisions."
},
{
  w: 5, title: "Your A/B test simulator", time: "2-3 h",
  pitch: "An interactive tool where you drag sliders for baseline rate, lift and sample size, and watch the false-positive rate explode when you peek early.",
  tools: ["Streamlit or Gradio", "your day-32 experiment code"],
  steps: [
    "Wrap your sample-size calculator in a Streamlit app with sliders",
    "Add a 'peeking' toggle that simulates checking daily and stopping at p<0.05",
    "Show the true false-positive rate climbing from 5% to 30%+ as peeking increases",
    "Deploy free on Streamlit Community Cloud"
  ],
  out: "A live interactive app anyone can play with.",
  share: "'Why your A/B test is lying to you' with the live link. This is a genuinely useful tool, not a toy.",
  why: "Peeking is the most common real-world experimentation mistake. Having built the demo makes the interview answer vivid."
},
{
  w: 6, title: "Watch a network learn, in real time", time: "3 h",
  pitch: "Record a neural net learning to separate a spiral dataset — the decision boundary bending frame by frame. Mesmerising and genuinely instructive.",
  tools: ["PyTorch", "matplotlib animation", "sklearn make_moons/spirals"],
  steps: [
    "Generate a 2-D spiral or moons dataset that a linear model cannot separate",
    "Train a small MLP, saving the decision boundary every N steps",
    "Animate the boundary evolving from a straight line into the correct curve",
    "Run it again with no hidden activation function and show it NEVER curves"
  ],
  out: "Two GIFs: with and without nonlinearity.",
  share: "'Why neural networks need activation functions, in one GIF.' The comparison is the whole post.",
  why: "Answers the guaranteed day-38 interview question with a picture you made."
},
{
  w: 7, title: "Live webcam classifier", time: "3-4 h",
  pitch: "Point your webcam at things and have your own fine-tuned model label them live, on your laptop. Instantly demoable in an interview.",
  tools: ["Your day-49 model", "OpenCV", "Gradio (webcam input)"],
  steps: [
    "Take the model you fine-tuned on your own photos",
    "Wire it to a webcam feed with OpenCV, drawing the prediction and confidence on frame",
    "Measure and display the FPS — latency is part of the product",
    "Deploy the Gradio version with webcam input so others can try it",
    "Record a 30-second screen capture of it working"
  ],
  out: "A live webcam demo plus a recording.",
  share: "The recording. Say what it's classifying, how many training images you collected, and the accuracy.",
  why: "'Can I try it?' is the best thing an interviewer can say. This makes that possible in 5 seconds."
},
{
  w: 8, title: "Map the meaning of your own notes", time: "3 h",
  pitch: "Embed all 8 weeks of your notes and plot them as an interactive 3-D galaxy where related concepts cluster together. Your own learning, as a map.",
  tools: ["sentence-transformers", "UMAP", "Plotly", "your daily notes"],
  steps: [
    "Embed every note and cheat card you've written so far",
    "Reduce to 3-D with UMAP and plot interactively in Plotly, coloured by phase",
    "Hover shows the note text",
    "Look for surprises: which topics sit near each other that you didn't expect?",
    "Export as a standalone HTML you can host"
  ],
  out: "An interactive 3-D map of everything you've learned.",
  share: "'I embedded 8 weeks of my own study notes.' Point out one genuinely surprising adjacency.",
  why: "Demonstrates embeddings, dimensionality reduction and visualisation at once — on data nobody else has."
},
{
  w: 9, title: "A model that writes like you", time: "4 h",
  pitch: "Fine-tune a small model on your own writing until it can imitate you. Slightly unsettling, extremely memorable.",
  tools: ["Unsloth or peft", "a small open model", "your own writing"],
  steps: [
    "Collect 200-500 samples of your own writing — notes, messages, essays, commit messages",
    "Format as instruction-response pairs and LoRA fine-tune a small model",
    "Compare base vs fine-tuned on the same prompt, side by side",
    "Have a friend try to tell which paragraph is you and which is the model",
    "Be honest in the writeup about how often it fails"
  ],
  out: "A fine-tuned model on HF Hub with an honest before/after.",
  share: "Post the blind-test results. If people can tell, say so — that's more credible than claiming it's perfect.",
  why: "Fine-tuning on data you created yourself is far more interesting than fine-tuning on a public dataset."
},
{
  w: 10, title: "Talk to your own notes", time: "4 h",
  pitch: "Ask a question out loud, and your 10 weeks of notes answer back in a voice — speech in, RAG in the middle, speech out.",
  tools: ["Whisper", "your day-67 RAG", "ElevenLabs", "Gradio"],
  steps: [
    "Whisper transcribes your spoken question",
    "Your existing RAG retrieves from your notes and answers with citations",
    "ElevenLabs speaks the answer",
    "Wire all three into one Gradio app with a microphone input",
    "Measure end-to-end latency and show it — voice pipelines live or die on latency"
  ],
  out: "A voice assistant over your own study notes.",
  share: "Record yourself asking it a question from week 3 and getting a cited answer.",
  why: "A multi-model pipeline (speech → retrieval → generation → speech) is a real systems build, not a single API call."
},
{
  w: 11, title: "An agent that researches companies for you", time: "4 h",
  pitch: "Give it a company name; it researches their AI stack, recent engineering blog posts and open roles, then drafts tailored talking points. Genuinely useful to you right now.",
  tools: ["Your day-71 agent", "a search API or Firecrawl", "structured output"],
  steps: [
    "Tools: web search, page fetch, and a structured extractor",
    "Output a fixed schema: tech stack, recent AI work, likely interview topics, 3 questions to ask them",
    "Run it on 10 companies from your application tracker",
    "Verify the output manually — note how often it hallucinates, and fix that with better grounding",
    "Feed the good output straight into your applications"
  ],
  out: "An agent that produces real interview prep, plus an honest accuracy note.",
  share: "Optional. Mostly this is for you — but the hallucination-rate analysis is a great blog post.",
  why: "It is simultaneously a portfolio agent project AND the research you need for actual interviews."
},
{
  w: 12, title: "Ship it with a real interface", time: "4 h",
  pitch: "Take your flagship RAG project and give it a proper product front-end — streaming responses, visible citations, and a live metrics panel.",
  tools: ["Chainlit or Streamlit", "v0 (for the UI)", "your day-76 project"],
  steps: [
    "Streaming responses — the perceived-latency win from day 75",
    "Citations shown as clickable sources next to each claim",
    "A small panel showing retrieval recall, latency and cost per query, live",
    "Deploy it publicly",
    "Record a 45-second walkthrough"
  ],
  out: "Your flagship project as an actual product.",
  share: "The walkthrough plus your real metrics. Showing cost and latency is what makes it look professional.",
  why: "The metrics panel is the differentiator. Almost nobody shows the numbers behind their demo."
},
{
  w: 13, title: "Your 90 days, as a film", time: "3 h",
  pitch: "A 90-second retrospective of the whole sprint — the projects, the charts, the demos, with AI voiceover and generated music. Post it on day 90.",
  tools: ["ElevenLabs", "Suno", "Runway or Canva", "all your screenshots"],
  steps: [
    "Pull the best visual from each of your 6 projects and 13 weekly builds",
    "Write a 200-word script: where you started, what you built, what you learned",
    "AI voiceover, AI-generated backing track, assembled into a video",
    "End with your GitHub and the live demo links",
    "Post on day 90, tag nobody, let the work speak"
  ],
  out: "A 90-second retrospective film.",
  share: "This is the post that gets you inbound messages from recruiters. Timed for when applications are live.",
  why: "Almost nobody documents a 90-day arc. The consistency is the story, and it's exactly what co-op managers screen for."
}
];
