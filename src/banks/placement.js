// Prueba de nivel de inglés tipo Cambridge: Listening (guiones con audio) y Writing (key word transformations).
// Los guiones completos para grabar los audios están en docs/audios-listening.md (generado de este archivo).
import { bank, listening } from "../lib/sources.js";

// ======================= LISTENING =======================
// Part 1 (A2): diálogos cortos, una pregunta cada uno.
listening("en.l.a2", [
  { id: "l-a2-01", title: "At the cinema", lines: [
    ["W", "Shall we go to the cinema tonight?"],
    ["M", "Good idea. The film starts at half past seven."],
    ["W", "Half past seven? I finish work at seven, so that's fine. Let's meet at quarter past."]],
    qs: [{ q: "What time does the film start?", o: ["At 7:30", "At 7:00", "At 7:15"] }] },
  { id: "l-a2-02", title: "Getting to school", lines: [
    ["W", "Dad, can you drive me to school today?"],
    ["M", "Sorry, the car is at the garage. Why don't you take the bus?"],
    ["W", "The bus is always late. I'll ride my bike."],
    ["M", "OK, but be careful."]],
    qs: [{ q: "How will the girl get to school?", o: ["By bike", "By car", "By bus"] }] },
  { id: "l-a2-03", title: "At the market", lines: [
    ["M", "I went to the market to buy some apples, but they were too expensive."],
    ["W", "So what did you get?"],
    ["M", "Some bananas and a pineapple."],
    ["W", "A pineapple? Great, I love it."]],
    qs: [{ q: "What did the man buy?", o: ["Bananas and a pineapple", "Apples and bananas", "Only apples"] }] },
  { id: "l-a2-04", title: "The lost phone", lines: [
    ["W", "Have you seen my phone? It's not in my bag."],
    ["M", "Did you leave it in the kitchen?"],
    ["W", "No, I've looked there."],
    ["M", "Look, it's on the sofa, under your jacket."]],
    qs: [{ q: "Where is the woman's phone?", o: ["On the sofa", "In the kitchen", "In her bag"] }] },
  { id: "l-a2-05", title: "The weather", lines: [
    ["N", "And now the weather. Today was sunny and warm, but tomorrow will be very different. Expect heavy rain in the morning and strong winds in the afternoon, so don't forget your umbrella."]],
    qs: [{ q: "What will the weather be like tomorrow?", o: ["Rainy and windy", "Sunny and warm", "Cold with snow"] }] },
  { id: "l-a2-06", title: "Buying T-shirts", lines: [
    ["W", "How much are these T-shirts?"],
    ["M", "They're twelve dollars each, but if you buy two, you get them for twenty."],
    ["W", "OK, I'll take two, please."]],
    qs: [{ q: "How much does the woman pay?", o: ["$20", "$12", "$24"] }] },
  { id: "l-a2-07", title: "Favourite subject", lines: [
    ["W", "Do you like maths, Diego?"],
    ["M", "It's OK, but I prefer science. Actually, my favourite subject is history. I love learning about the past."]],
    qs: [{ q: "What is Diego's favourite subject?", o: ["History", "Maths", "Science"] }] },
  { id: "l-a2-08", title: "The party", lines: [
    ["M", "Are you coming to Sofía's party on Friday?"],
    ["W", "I thought it was on Saturday."],
    ["M", "No, she changed it. It's on Friday now, because her parents are travelling on Saturday."]],
    qs: [{ q: "When is the party?", o: ["On Friday", "On Saturday", "On Sunday"] }] },
]);

// Part 2 (B1): anuncios, mensajes y relatos.
listening("en.l.b1", [
  { id: "l-b1-01", title: "Summer courses at the library", lines: [
    ["W", "Hello everyone, and welcome to the City Library summer programme. This year we're offering three free courses for teenagers. The photography course is on Mondays and Wednesdays from ten to twelve. The creative writing course takes place on Tuesday afternoons, and the coding course, which is new this year, is on Thursdays. Places are limited to fifteen students per course, so please sign up at the front desk before the twentieth of June. Remember to bring a copy of your ID card when you register."]],
    qs: [
      { q: "Which course is new this year?", o: ["Coding", "Photography", "Creative writing"] },
      { q: "How many students can join each course?", o: ["15", "10", "20"] },
      { q: "What do you need to bring when you register?", o: ["A copy of your ID card", "A photo", "Twenty dollars"] },
    ] },
  { id: "l-b1-02", title: "Volunteering in Galápagos", lines: [
    ["M", "Last year I spent three months volunteering at a turtle conservation project in Galápagos. I'd always been interested in animals, but I had never done anything like this. The work was harder than I expected: we got up at five every morning to clean the beaches and count the nests. The best part was seeing the baby turtles reach the sea for the first time. What I found most difficult wasn't the work, though. It was being away from my family for so long. Next year I'm planning to study marine biology."]],
    qs: [
      { q: "How long did he volunteer?", o: ["Three months", "Three weeks", "One year"] },
      { q: "What was the most difficult part for him?", o: ["Being away from his family", "Getting up early", "Cleaning the beaches"] },
      { q: "What is he planning to do next year?", o: ["Study marine biology", "Go back to Galápagos", "Work with his family"] },
    ] },
  { id: "l-b1-03", title: "A phone message", lines: [
    ["W", "Hi Marco, it's Laura. I'm calling about our project for Thursday. I've finished the introduction and the graphs, but I still need your part about the survey results. Could you send it to me by Tuesday night? Then I'll have Wednesday to put everything together. Oh, and the teacher said we can't use more than ten slides, so keep it short. Call me back if there's a problem. Bye!"]],
    qs: [
      { q: "What has Laura already done?", o: ["The introduction and the graphs", "The survey results", "All the slides"] },
      { q: "When does Marco need to send his part?", o: ["By Tuesday night", "On Wednesday", "On Thursday morning"] },
      { q: "What did the teacher say?", o: ["They can use ten slides or fewer", "They need more graphs", "The project is due on Tuesday"] },
    ] },
  { id: "l-b1-04", title: "A tour of Otavalo", lines: [
    ["M", "Good morning and welcome to Otavalo. Our tour today starts here at the famous Plaza de los Ponchos, where you'll have an hour and a half to explore the market. Please be careful with your bags, because it gets very crowded. At twelve thirty we'll take the bus to Peguche waterfall, where we'll have lunch. The walk to the waterfall takes about fifteen minutes, so wear comfortable shoes. We'll be back in Otavalo by five."]],
    qs: [
      { q: "How long can they spend at the market?", o: ["An hour and a half", "Fifteen minutes", "Two hours"] },
      { q: "Where will they have lunch?", o: ["At Peguche waterfall", "At the Plaza de los Ponchos", "On the bus"] },
      { q: "What does the guide recommend?", o: ["Wearing comfortable shoes", "Buying ponchos early", "Bringing their own lunch"] },
    ] },
]);

// Part 3 (B2): entrevistas y conversaciones.
listening("en.l.b2", [
  { id: "l-b2-01", title: "A young entrepreneur", lines: [
    ["W", "Today I'm talking to Andrés, who started a business selling recycled backpacks when he was only nineteen. Andrés, how did it all begin?"],
    ["M", "Honestly, by accident. I needed a bag for university and couldn't afford a new one, so I made one out of old banners. A few classmates asked me to make them one too, and I realised there was a market."],
    ["W", "Was it difficult at first?"],
    ["M", "The hardest thing wasn't making the bags; it was learning to manage money. In the first year I sold quite a lot but barely made a profit, because I hadn't calculated my costs properly."],
    ["W", "What advice would you give to young people?"],
    ["M", "Don't wait until you have the perfect idea. Start small and make your mistakes early, when they're cheap."]],
    qs: [
      { q: "How did Andrés's business start?", o: ["He made a bag for himself and others wanted one", "He studied business at university", "He won a competition"] },
      { q: "What was his main problem in the first year?", o: ["He hadn't calculated his costs properly", "He couldn't sell enough bags", "He had no materials"] },
      { q: "What is his advice to young people?", o: ["Start small and accept early mistakes", "Wait for the perfect idea", "Borrow money from a bank"] },
    ] },
  { id: "l-b2-02", title: "Teenagers and sleep", lines: [
    ["M", "Many parents believe that teenagers who use their phones at night are simply lazy in the mornings. However, research suggests the problem is more complex. Doctor Vega, can you explain?"],
    ["W", "Certainly. During adolescence, the body clock naturally shifts later, so teenagers genuinely feel sleepy later at night. Screens make this worse, because the light delays the release of melatonin, the hormone that helps us fall asleep. So it isn't laziness. It's biology plus habits."],
    ["M", "So what should families do?"],
    ["W", "Rather than banning phones completely, which rarely works, I'd suggest agreeing on a time when all devices go into another room. And that includes the parents' devices."]],
    qs: [
      { q: "According to Dr Vega, why do teenagers feel sleepy later?", o: ["Their body clock changes naturally", "They are lazy", "They drink too much coffee"] },
      { q: "What effect does screen light have?", o: ["It delays the release of melatonin", "It produces more melatonin", "It improves concentration"] },
      { q: "What does she recommend?", o: ["The whole family leaves devices in another room", "Banning phones for teenagers", "Using phones only in the morning"] },
    ] },
  { id: "l-b2-03", title: "Studying online", lines: [
    ["W", "I have to say, I didn't expect to enjoy the online course as much as I did."],
    ["M", "Really? I found it hard to stay motivated without a teacher in the room."],
    ["W", "That's true at the beginning, but once I set myself a fixed timetable, it was fine. And I could watch the explanations again whenever I got lost."],
    ["M", "I suppose that's an advantage. What I missed most was chatting with classmates after class."],
    ["W", "Well, I agree that you lose some of the social side. That's why I'd choose a mix: online lessons with a face-to-face session every week."]],
    qs: [
      { q: "What helped the woman stay motivated?", o: ["Setting a fixed timetable", "Having a teacher in the room", "Studying with classmates"] },
      { q: "What did the man miss most?", o: ["Chatting with classmates", "Watching explanations again", "The online materials"] },
      { q: "What do they both agree on?", o: ["Online learning loses some of the social side", "Online courses are better than face-to-face ones", "Motivation is never a problem online"] },
    ] },
]);

// Part 4 (C1): conferencias y debates, con inferencia y actitud del hablante.
listening("en.l.c1", [
  { id: "l-c1-01", title: "Language and thought", lines: [
    ["W", "There's a popular idea that the language we speak determines what we're able to think. In its strong form, this claim has largely been abandoned: speakers of languages without a word for a particular colour can still perceive that colour perfectly well. What researchers do accept, however, is a weaker version: that language can nudge our attention. For example, speakers of languages that describe directions using north, south, east and west, rather than left and right, tend to be remarkably good at keeping track of where they are. So language doesn't imprison thought, but it may well train certain habits of mind."]],
    qs: [
      { q: "What does the speaker say about the strong version of the idea?", o: ["Most researchers have rejected it", "Colour studies have proven it", "Most linguists accept it"] },
      { q: "The example about directions shows that…", o: ["language can influence what people pay attention to", "some languages have no words for directions", "left and right are easier to learn"] },
      { q: "What is the speaker's overall view?", o: ["Language trains habits of thought but does not limit it", "Language completely determines thought", "Language has no connection with thought"] },
    ] },
  { id: "l-c1-02", title: "Who benefits from tourism?", lines: [
    ["M", "The argument that tourism automatically benefits local communities simply doesn't hold up. In many destinations, most of the money ends up with international hotel chains and tour operators."],
    ["W", "I'd challenge that slightly. It depends enormously on how tourism is managed. In community-based projects in the Amazon, for instance, families own the lodges and decide how many visitors to accept."],
    ["M", "Granted, but those projects are the exception, not the rule. And even there, visitor numbers can creep up once a place becomes fashionable."],
    ["W", "Which is precisely why regulation matters. The problem isn't tourism itself; it's leaving it entirely to the market."]],
    qs: [
      { q: "What is the man's main criticism of tourism?", o: ["Local communities often receive little of the money", "It damages the Amazon more than other places", "Tourists are not interested in local culture"] },
      { q: "How does the woman respond?", o: ["She argues that the result depends on how it is managed", "She completely agrees with him", "She says international hotels are the solution"] },
      { q: "What does the man concede?", o: ["Some community projects work, although they are rare", "Tourism should be banned", "Regulation is unnecessary"] },
    ] },
]);

// ======================= WRITING · key word transformations (B2 First / C1 Advanced, parte 4) =======================
const KWT = "Complete the second sentence so that it means the same as the first. Use the word in capitals and write only the missing words (2–5 words).";
const k = (first, word, second, a) => ({ q: `${KWT}\n\n${first}\n${word}\n${second}`, a });
bank("en.kwt.b2", [
  k("It isn't necessary for you to bring food.", "HAVE", "You ___ bring food.", ["don't have to", "do not have to"]),
  k("I last saw Ana three years ago.", "SEEN", "I ___ three years.", ["haven't seen ana for", "have not seen ana for", "haven't seen her for", "have not seen her for"]),
  k("They will build a new hospital next year.", "BE", "A new hospital ___ next year.", ["will be built"]),
  k("\"I'll call you tomorrow,\" Tom said to me.", "WOULD", "Tom told me ___ me the next day.", ["he would call", "that he would call", "he'd call", "that he'd call"]),
  k("I regret not studying harder.", "WISH", "I ___ harder.", ["wish i had studied", "wish i'd studied"]),
  k("The film was so boring that we left early.", "SUCH", "It was ___ that we left early.", ["such a boring film", "such a boring movie"]),
  k("Perhaps Paul forgot about the meeting.", "MIGHT", "Paul ___ about the meeting.", ["might have forgotten"]),
  k("We couldn't go out because of the rain.", "PREVENTED", "The rain ___ out.", ["prevented us from going"]),
  k("It's a long time since I went to the cinema.", "BEEN", "I ___ the cinema for a long time.", ["haven't been to", "have not been to"]),
  k("Carla is too young to drive.", "ENOUGH", "Carla ___ to drive.", ["isn't old enough", "is not old enough"]),
  k("Somebody stole my bike last night.", "WAS", "My bike ___ last night.", ["was stolen"]),
  k("I started learning English five years ago.", "BEEN", "I ___ English for five years.", ["have been learning", "'ve been learning", "have been studying"]),
]);
bank("en.kwt.c1", [
  k("As soon as she arrived, the meeting started.", "SOONER", "No ___ the meeting started.", ["sooner had she arrived than"]),
  k("I didn't realise how serious the problem was until later.", "DID", "Only later ___ how serious the problem was.", ["did i realise", "did i realize"]),
  k("It's possible that he missed the train.", "MAY", "He ___ the train.", ["may have missed"]),
  k("People say that the company is in trouble.", "SAID", "The company ___ in trouble.", ["is said to be"]),
  k("I'd prefer you not to smoke here.", "RATHER", "I'd ___ smoke here.", ["rather you didn't", "rather you did not"]),
  k("He succeeded although he had little money.", "FACT", "He succeeded despite ___ little money.", ["the fact that he had", "the fact he had"]),
  k("It was wrong of you to shout at her.", "SHOULDN'T", "You ___ at her.", ["shouldn't have shouted"]),
  k("They postponed the match because of the storm.", "PUT", "The match ___ because of the storm.", ["was put off"]),
  k("It's pointless to complain now.", "POINT", "There's ___ now.", ["no point in complaining", "no point complaining"]),
  k("I had never seen such a beautiful view.", "BEFORE", "Never ___ such a beautiful view.", ["before had i seen"]),
]);
