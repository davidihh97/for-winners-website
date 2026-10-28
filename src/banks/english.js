import { bank, gen, passages } from "../lib/sources.js";
import { options } from "../lib/rand.js";

const SUBJ = [["I", 1], ["You", 2], ["He", 3], ["She", 3], ["It", 3], ["We", 2], ["They", 2], ["My brother", 3], ["Our teachers", 2], ["The dog", 3]];
const lower = s => (s === "I" ? s : s[0].toLowerCase() + s.slice(1));

// ======================= GRAMMAR · generadores =======================
gen("en.be", r => {
  const [s, p] = r.pick(SUBJ);
  const tail = r.pick(["happy today", "at school", "from Ecuador", "very tired", "in the kitchen", "ready for the test"]);
  const ans = p === 1 ? "am" : p === 3 ? "is" : "are";
  return { prompt: `${s} ___ ${tail}.`, options: options(ans, ["am", "is", "are", "be"]), explain: `Con «${s}» se usa «${ans}».` };
});
gen("en.article", r => {
  const [n, a] = r.pick([["apple", "an"], ["umbrella", "an"], ["hour", "an"], ["university", "a"], ["egg", "an"], ["car", "a"], ["orange", "an"], ["European city", "a"], ["honest man", "an"], ["book", "a"], ["elephant", "an"], ["uniform", "a"]]);
  return { prompt: `I have ___ ${n}.`, options: options(a, a === "a" ? ["an", "the a", "–"] : ["a", "the an", "–"]), explain: "«an» va antes de sonido vocálico; «a» antes de sonido consonante (university /juː/, hour /aʊ/)." };
});
const VERBS = [["play", "plays"], ["watch", "watches"], ["study", "studies"], ["go", "goes"], ["have", "has"], ["live", "lives"], ["work", "works"], ["fix", "fixes"], ["cry", "cries"], ["do", "does"]];
gen("en.ps3", r => {
  const [s, p] = r.pick(SUBJ.filter(x => x[0] !== "It"));
  const [base, third] = r.pick(VERBS);
  const neg = r.chance(0.3);
  const obj = { play: "football", watch: "TV", study: "English", go: "to the gym", have: "breakfast", live: "in Ibarra", work: "on Saturdays", fix: "computers", cry: "at sad movies", do: "homework" }[base];
  if (neg) {
    const ans = p === 3 ? `doesn't ${base}` : `don't ${base}`;
    return { prompt: `${s} ___ (not / ${base}) ${obj}.`, options: options(ans, [p === 3 ? `don't ${base}` : `doesn't ${base}`, `doesn't ${third}`, `not ${base}`]), explain: "Negativo en presente simple: don't / doesn't + verbo base." };
  }
  const ans = p === 3 ? third : base;
  return { prompt: `${s} ___ (${base}) ${obj} every day.`, options: options(ans, [p === 3 ? base : third, `is ${base}`, `${base}ing`.replace(/e?ing$/, "ing")]), explain: "Presente simple: con he/she/it el verbo lleva -s / -es / -ies." };
});
const IRR = [["go", "went", "gone"], ["see", "saw", "seen"], ["eat", "ate", "eaten"], ["buy", "bought", "bought"], ["write", "wrote", "written"], ["take", "took", "taken"], ["drink", "drank", "drunk"], ["make", "made", "made"], ["bring", "brought", "brought"], ["begin", "began", "begun"], ["speak", "spoke", "spoken"], ["leave", "left", "left"], ["find", "found", "found"], ["swim", "swam", "swum"], ["give", "gave", "given"], ["choose", "chose", "chosen"], ["teach", "taught", "taught"], ["break", "broke", "broken"]];
const OBJ = { go: "to the beach", see: "a great movie", eat: "pizza", buy: "a new phone", write: "an email", take: "the bus", drink: "orange juice", make: "a cake", bring: "my notebook", begin: "a new course", speak: "with the director", leave: "home early", find: "my keys", swim: "in the lake", give: "her a present", choose: "the blue shirt", teach: "the class", break: "a glass" };
gen("en.past", r => {
  const [b, p, pp] = r.pick(IRR);
  const [s] = r.pick(SUBJ);
  const when = r.pick(["Yesterday", "Last week", "Two days ago", "Last Saturday"]);
  return { prompt: `${when} ${lower(s)} ___ (${b}) ${OBJ[b]}.`, options: options(p, [pp === p ? `${b}ed` : pp, `${b}ed`, b, `was ${b}`]), explain: `Pasado simple de «${b}»: ${p}.` };
});
gen("en.pp", r => {
  const [b, p, pp] = r.pick(IRR);
  const [s, pers] = r.pick(SUBJ);
  const aux = pers === 3 ? "has" : "have";
  return { prompt: `${s} ${aux} never ___ (${b}) ${OBJ[b]}.`, options: options(pp, [p, `${b}ed`, b]), explain: `Present perfect: have/has + participio (${pp}).` };
});
const ADJ = [["tall", "taller", "the tallest"], ["big", "bigger", "the biggest"], ["happy", "happier", "the happiest"], ["expensive", "more expensive", "the most expensive"], ["good", "better", "the best"], ["bad", "worse", "the worst"], ["interesting", "more interesting", "the most interesting"], ["easy", "easier", "the easiest"], ["far", "farther", "the farthest"], ["beautiful", "more beautiful", "the most beautiful"]];
gen("en.comp", r => {
  const [a, c, s] = r.pick(ADJ);
  const [x, y] = r.sample(["Quito", "Ibarra", "my car", "this book", "Ana", "Tom", "the red one", "Monday"], 2);
  if (r.chance(0.5)) return { prompt: `${x[0].toUpperCase() + x.slice(1)} is ___ (${a}) than ${y}.`, options: options(c, [s.replace("the ", ""), `more ${a}`, `${a}er`].filter(o => o !== c)), explain: `Comparativo de «${a}»: ${c}.` };
  return { prompt: `It is ___ (${a}) day of the year.`, options: options(s, [c, `the ${a}`, `the more ${a}`].filter(o => o !== s)), explain: `Superlativo de «${a}»: ${s}.` };
});
gen("en.cond", r => {
  const kind = r.pick([1, 2, 3]);
  const [b, p, pp] = r.pick([["have", "had", "had"], ["study", "studied", "studied"], ["know", "knew", "known"], ["see", "saw", "seen"], ["leave", "left", "left"], ["take", "took", "taken"]]);
  const res = r.pick(["pass the exam", "call you", "travel to Galápagos", "buy a house", "arrive on time"]);
  const [rb, , rpp] = { "pass the exam": ["pass", "passed", "passed"], "call you": ["call", "called", "called"], "travel to Galápagos": ["travel", "travelled", "travelled"], "buy a house": ["buy", "bought", "bought"], "arrive on time": ["arrive", "arrived", "arrived"] }[res];
  const rest = res.split(" ").slice(1).join(" ");
  const obj = { have: "more time", study: "harder", know: "the answer", see: "her", leave: "earlier", take: "a taxi" }[b];
  if (kind === 1) return { prompt: `If I ___ (${b}) ${obj}, I will ${res}.`, options: options(b, [p, `would ${b}`, `will ${b}`]), explain: "Primer condicional: If + presente, will + verbo." };
  if (kind === 2) return { prompt: `If I ___ (${b}) ${obj}, I would ${res}.`, options: options(p, [b, `would ${b}`, `had ${pp}`]), explain: "Segundo condicional: If + pasado, would + verbo." };
  return { prompt: `If I had ${pp} ${obj}, I ___ ${rest}.`.replace(` ${rest}.`, ` (${rb}) ${rest}.`), options: options(`would have ${rpp}`, [`would ${rb}`, `will have ${rpp}`, `had ${rpp}`]), explain: "Tercer condicional: If + had + participio, would have + participio." };
});
gen("en.passive", r => {
  const [b, p, pp] = r.pick([["build", "built", "built"], ["write", "wrote", "written"], ["clean", "cleaned", "cleaned"], ["make", "made", "made"], ["sell", "sold", "sold"], ["paint", "painted", "painted"]]);
  const obj = { build: "The bridge", write: "The letters", clean: "The rooms", make: "These shoes", sell: "The tickets", paint: "The house" }[b];
  const plural = /s$/.test(obj);
  const past = r.chance(0.5);
  const aux = past ? (plural ? "were" : "was") : (plural ? "are" : "is");
  return { prompt: `${obj} ___ (${b}) ${past ? "last year" : "every day"}.`, options: options(`${aux} ${pp}`, [past ? p : `${b}s`, `${aux} ${b}ing`.replace("eing", "ing"), `${plural ? (past ? "was" : "is") : past ? "were" : "are"} ${pp}`]), explain: `Voz pasiva: be (${aux}) + participio (${pp}).` };
});

// ======================= GRAMMAR · bancos por nivel =======================
bank("en.g.a1", [
  { q: "___ you like pizza? — Yes, I do.", o: ["Do", "Does", "Are", "Is"] },
  { q: "There ___ two books on the table.", o: ["are", "is", "be", "am"] },
  { q: "This is ___ pencil. (de ella)", o: ["her", "she", "hers", "his"] },
  { q: "I get up ___ 7 o'clock.", o: ["at", "in", "on", "to"] },
  { q: "My birthday is ___ May.", o: ["in", "at", "on", "for"] },
  { q: "We go to the park ___ Sundays.", o: ["on", "in", "at", "to"] },
  { q: "The plural of «child» is:", o: ["children", "childs", "childes", "childrens"] },
  { q: "___ is your name? — My name is Ana.", o: ["What", "Who", "Where", "How"] },
  { q: "She can ___ the guitar.", o: ["play", "plays", "playing", "to play"] },
  { q: "Look! The baby ___ .", o: ["is sleeping", "sleeps", "sleep", "are sleeping"] },
  { q: "How ___ apples do you want?", o: ["many", "much", "long", "old"] },
  { q: "These ___ my friends.", o: ["are", "is", "am", "be"] },
  { q: "I ___ a student.", o: ["am", "is", "are", "be"] },
  { q: "___ there a bank near here?", o: ["Is", "Are", "Do", "Does"] },
  { q: "Can you help ___ , please? (a mí)", o: ["me", "I", "my", "mine"] },
  { q: "My father ___ a car.", o: ["has", "have", "haves", "having"] },
]);
bank("en.g.a2", [
  { q: "I ___ TV when the phone rang.", o: ["was watching", "watched", "am watching", "watch"] },
  { q: "We ___ visit our grandparents next weekend.", o: ["are going to", "going to", "goes to", "will to"] },
  { q: "You ___ wear a seatbelt. It's the law.", o: ["must", "mustn't", "can", "don't have to"] },
  { q: "Did you ___ the email?", o: ["send", "sent", "sends", "sending"] },
  { q: "There isn't ___ milk in the fridge.", o: ["any", "some", "many", "a"] },
  { q: "She's ___ than her sister.", o: ["older", "more old", "oldest", "the older"] },
  { q: "I've lived here ___ 2019.", o: ["since", "for", "from", "ago"] },
  { q: "He ___ his homework yet.", o: ["hasn't finished", "didn't finish", "doesn't finish", "not finished"] },
  { q: "I'm interested ___ learning French.", o: ["in", "on", "at", "for"] },
  { q: "Would you like ___ coffee?", o: ["some", "any", "many", "few"] },
  { q: "She speaks English very ___ .", o: ["well", "good", "best", "better"] },
  { q: "I'm not as tall ___ my brother.", o: ["as", "than", "like", "that"] },
  { q: "They ___ to Cuenca last summer.", o: ["went", "go", "have gone", "were go"] },
  { q: "___ you ever been to Galápagos?", o: ["Have", "Did", "Were", "Do"] },
  { q: "I usually ___ to work by bus.", o: ["go", "am going", "goes", "went"] },
  { q: "What time ___ the movie start?", o: ["does", "do", "is", "has"] },
]);
bank("en.g.b1", [
  { q: "I'm used to ___ up early.", o: ["getting", "get", "got", "gets"] },
  { q: "She suggested ___ to the museum.", o: ["going", "to go", "go", "went"] },
  { q: "I'd rather ___ at home tonight.", o: ["stay", "staying", "to stay", "stayed"] },
  { q: "The man ___ car was stolen called the police.", o: ["whose", "who", "which", "whom"] },
  { q: "By the time we arrived, the film ___ .", o: ["had started", "has started", "started", "was starting"] },
  { q: "If it rains tomorrow, we ___ the picnic.", o: ["will cancel", "would cancel", "cancel", "cancelled"] },
  { q: "He has been working here ___ five years.", o: ["for", "since", "during", "ago"] },
  { q: "You ___ have told me! I would have helped you.", o: ["should", "must", "can", "will"] },
  { q: "I'm looking forward ___ you.", o: ["to seeing", "to see", "seeing", "see"] },
  { q: "She told me that she ___ tired.", o: ["was", "is", "be", "were being"] },
  { q: "Neither Tom ___ Ana came to the party.", o: ["nor", "or", "and", "but"] },
  { q: "This is the ___ interesting book I've ever read.", o: ["most", "more", "much", "very"] },
  { q: "I wish I ___ more free time.", o: ["had", "have", "will have", "having"] },
  { q: "The project must ___ by Friday.", o: ["be finished", "finish", "be finishing", "finished"] },
  { q: "Despite ___ tired, she kept studying.", o: ["being", "be", "she was", "to be"] },
  { q: "I don't know where ___ .", o: ["he lives", "does he live", "lives he", "he does live"] },
]);
bank("en.g.b2", [
  { q: "If I ___ you, I would accept the offer.", o: ["were", "am", "would be", "had been"] },
  { q: "She ___ have left already; her coat isn't here.", o: ["must", "can't", "should", "needn't"] },
  { q: "He denied ___ the money.", o: ["taking", "to take", "take", "to have take"] },
  { q: "Hardly had we sat down ___ the lights went out.", o: ["when", "than", "then", "that"] },
  { q: "The report, ___ was published yesterday, is controversial.", o: ["which", "that", "what", "whose"] },
  { q: "I'd rather you ___ smoke in here.", o: ["didn't", "don't", "won't", "not"] },
  { q: "By next June, I ___ here for ten years.", o: ["will have worked", "will work", "am working", "have worked"] },
  { q: "He asked me where I ___ the day before.", o: ["had been", "have been", "was being", "am"] },
  { q: "It's high time we ___ a decision.", o: ["made", "make", "will make", "have made"] },
  { q: "She's not accustomed ___ in public.", o: ["to speaking", "to speak", "speaking", "speak"] },
  { q: "The house is said ___ built in 1900.", o: ["to have been", "to be", "being", "that was"] },
  { q: "Unless you ___ harder, you won't pass.", o: ["study", "don't study", "will study", "studied"] },
  { q: "I regret ___ you that your application was rejected.", o: ["to tell", "telling", "tell", "told"] },
  { q: "We had our house ___ last month.", o: ["painted", "paint", "to paint", "painting"] },
  { q: "No sooner had he arrived ___ it started to rain.", o: ["than", "when", "then", "that"] },
  { q: "You needn't ___ so early. The shop opens at ten.", o: ["have come", "come", "came", "to come"] },
]);
bank("en.g.c1", [
  { q: "Not only ___ late, but he also forgot the documents.", o: ["did he arrive", "he arrived", "he did arrive", "arrived he"] },
  { q: "Had I known about the traffic, I ___ earlier.", o: ["would have left", "would leave", "had left", "will leave"] },
  { q: "If she had taken the job, she ___ in Madrid now.", o: ["would be living", "would have lived", "will live", "lived"] },
  { q: "It is essential that every student ___ the form.", o: ["submit", "submits", "submitted", "will submit"] },
  { q: "Little ___ that his life was about to change.", o: ["did he know", "he knew", "he did know", "knew he"] },
  { q: "So complex ___ the problem that nobody could solve it.", o: ["was", "it was", "were", "did"] },
  { q: "I'd sooner you ___ the matter with anyone.", o: ["didn't discuss", "don't discuss", "not discuss", "won't discuss"] },
  { q: "Were the government ___ taxes, there would be protests.", o: ["to raise", "raising", "raise", "raised"] },
  { q: "She is thought ___ the country last week.", o: ["to have left", "to leave", "having left", "that she left"] },
  { q: "On no account ___ the door to strangers.", o: ["should you open", "you should open", "open you", "you open"] },
  { q: "The more you practise, ___ you become.", o: ["the more confident", "more confident", "the most confident", "the confident"] },
  { q: "Only after the results were published ___ the mistake.", o: ["did they notice", "they noticed", "noticed they", "they did notice"] },
  { q: "He talks as though he ___ everything.", o: ["knew", "knows", "had know", "is knowing"] },
  { q: "Should you ___ any problems, contact us immediately.", o: ["have", "had", "having", "to have"] },
  { q: "Much ___ I admire her, I can't agree with her.", o: ["as", "though", "that", "so"] },
  { q: "There's no point ___ about it now.", o: ["in worrying", "to worry", "worry", "for worry"] },
]);

// ======================= WRITING =======================
// Ordenar palabras (por nivel)
bank("en.w.order.a1", [
  { s: "My sister is a teacher" }, { s: "I live in a small house" }, { s: "We have English on Monday" }, { s: "He doesn't like coffee" },
  { s: "Where do you live" }, { s: "The cat is under the table" }, { s: "They play football every weekend" }, { s: "I can speak two languages" },
  { s: "Is your father at home" }, { s: "She has got long black hair" },
], { orderPrompt: "Writing · Ordena las palabras para formar una oración correcta." });
bank("en.w.order.a2", [
  { s: "I went to the cinema last night" }, { s: "We are going to visit Otavalo next week" }, { s: "Have you ever eaten ceviche" },
  { s: "She was reading when I arrived" }, { s: "You must not use your phone in class" }, { s: "My brother is taller than me" },
  { s: "How long have you lived here" }, { s: "There are not many people in the park" }, { s: "I usually walk to school" }, { s: "Did they finish the project on time" },
], { orderPrompt: "Writing · Ordena las palabras para formar una oración correcta." });
bank("en.w.order.b1", [
  { s: "I have been studying English for three years" }, { s: "If it rains we will stay at home" }, { s: "The book that you lent me was amazing" },
  { s: "She asked me where I was from" }, { s: "I am looking forward to meeting you" }, { s: "The museum was built in the nineteenth century" },
  { s: "Although he was tired he finished the report" }, { s: "You should have called me earlier" }, { s: "I would rather stay at home tonight" }, { s: "Do you know what time the bus leaves" },
], { orderPrompt: "Writing · Ordena las palabras para formar una oración correcta." });
bank("en.w.order.b2", [
  { s: "If I had known I would have helped you" }, { s: "The results are expected to be announced tomorrow" }, { s: "Not only is she smart but also very kind" },
  { s: "I wish I had studied harder for the exam" }, { s: "He is believed to have left the country" }, { s: "We had our car repaired last week" },
  { s: "By the time you arrive we will have finished" }, { s: "It is high time we made a decision" }, { s: "Hardly had we started when it began to rain" }, { s: "She denied having taken the money" },
], { orderPrompt: "Writing · Ordena las palabras para formar una oración correcta." });
bank("en.w.order.c1", [
  { s: "Never before had I seen such a beautiful landscape" }, { s: "Had it not been for your help I would have failed" }, { s: "Under no circumstances should you share your password" },
  { s: "It is vital that he attend the meeting" }, { s: "Little did they know what was about to happen" }, { s: "Were I to win the lottery I would travel the world" },
  { s: "Only by working together can we solve this problem" }, { s: "So difficult was the test that few students passed" },
], { orderPrompt: "Writing · Ordena las palabras para formar una oración correcta." });

// Detectar la oración correcta / conectores / reescritura
bank("en.w.fix.a1", [
  { q: "Writing · Choose the correct sentence:", o: ["She is from Ecuador.", "She are from Ecuador.", "She from Ecuador.", "She is of Ecuador."] },
  { q: "Writing · Choose the correct sentence:", o: ["I don't have a car.", "I not have a car.", "I doesn't have a car.", "I haven't a car no."] },
  { q: "Writing · Choose the correct sentence:", o: ["They have two children.", "They has two children.", "They have two childs.", "They having two children."] },
  { q: "Writing · Choose the best connector: I like tea ___ I don't like coffee.", o: ["but", "because", "so", "or"] },
  { q: "Writing · Choose the best connector: I'm hungry, ___ I'm going to eat.", o: ["so", "but", "because", "or"] },
  { q: "Writing · Complete with one word: My name ___ Carlos. (verb «to be»)", a: ["is"] },
  { q: "Writing · Complete with one word: I ___ 15 years old. (verb «to be»)", a: ["am", "'m"] },
]);
bank("en.w.fix.a2", [
  { q: "Writing · Choose the correct sentence:", o: ["I went to the beach yesterday.", "I go to the beach yesterday.", "I goed to the beach yesterday.", "I have gone to the beach yesterday."] },
  { q: "Writing · Choose the correct sentence:", o: ["She's better at maths than me.", "She's more good at maths than me.", "She's gooder at maths than me.", "She's best at maths than me."] },
  { q: "Writing · Choose the best connector: I stayed at home ___ I was sick.", o: ["because", "so", "but", "although"] },
  { q: "Writing · Choose the best connector: First, open the box. ___ , read the instructions.", o: ["Then", "Because", "But", "Although"] },
  { q: "Writing · Complete: We ___ (not / go) to the party last Friday.", a: ["didn't go", "did not go"] },
  { q: "Writing · Complete: ___ you ever visited Cuenca? (one word)", a: ["have"] },
  { q: "Writing · Choose the correct sentence for an informal email:", o: ["Hi Sam, thanks for your message!", "Dear Sir, thanks for your message!", "Hi Sam, I am writing to complain formally.", "To whom it may concern, hi!"] },
]);
bank("en.w.fix.b1", [
  { q: "Writing · Choose the correct sentence:", o: ["I've known her since 2015.", "I know her since 2015.", "I've known her for 2015.", "I'm knowing her since 2015."] },
  { q: "Writing · Choose the best connector: ___ it was raining, we went for a walk.", o: ["Although", "Because", "So", "Therefore"] },
  { q: "Writing · Choose the best connector: The tickets were expensive. ___ , we decided to buy them.", o: ["However", "Because", "So that", "Unless"] },
  { q: "Writing · Choose the best opening for a formal email:", o: ["Dear Mr. Torres,", "Hey Torres!", "What's up, Mr. Torres?", "Hi buddy,"] },
  { q: "Writing · Choose the best closing for a formal letter:", o: ["Yours sincerely,", "See ya!", "Love,", "Cheers mate,"] },
  { q: "Writing · Complete: She asked me if I ___ (can) help her. (one word)", a: ["could"] },
  { q: "Writing · Complete: The new hospital ___ (open) next month. (passive, future: 3 words)", a: ["will be opened"] },
  { q: "Writing · Choose the sentence with correct punctuation:", o: ["However, the results were positive.", "However the results, were positive.", "However; the results were positive.", "However the results were positive,"] },
]);
bank("en.w.fix.b2", [
  { q: "Writing · Choose the most formal option: «We want to know more about the course.»", o: ["We would like further information about the course.", "We wanna know more stuff about the course.", "Tell us more about the course.", "Course info, please."] },
  { q: "Writing · Choose the best connector: The plan is cheap. ___ , it is easy to implement.", o: ["Furthermore", "Nevertheless", "Whereas", "Otherwise"] },
  { q: "Writing · Choose the best connector: Some students prefer online classes, ___ others prefer face-to-face lessons.", o: ["whereas", "therefore", "moreover", "as a result"] },
  { q: "Writing · Choose the best topic sentence for an essay about social media:", o: ["Social media has transformed the way young people communicate.", "I have Instagram.", "Social media is good and bad and other things.", "Do you like social media?"] },
  { q: "Writing · Rewrite: «I didn't study, so I failed.» → If I ___ studied, I wouldn't have failed. (one word)", a: ["had"] },
  { q: "Writing · Complete: Despite ___ (have) little time, she finished the essay. (one word)", a: ["having"] },
  { q: "Writing · Choose the correct sentence:", o: ["The number of students has increased.", "The number of students have increased.", "The amount of students has increased.", "The number of student has increased."] },
  { q: "Writing · Choose the best way to express contrast in an academic essay:", o: ["On the other hand,", "And also,", "So,", "Like I said,"] },
]);
bank("en.w.fix.c1", [
  { q: "Writing · Choose the most concise academic version:", o: ["The findings suggest a strong correlation.", "The findings that we found seem to suggest that there is maybe a strong correlation.", "We found stuff that correlates a lot.", "It is kind of correlated strongly."] },
  { q: "Writing · Choose the best hedging expression for academic writing:", o: ["It could be argued that", "Everybody knows that", "It is 100% true that", "Obviously"] },
  { q: "Writing · Choose the best connector: The policy was unpopular; ___ , it achieved its goals.", o: ["nonetheless", "hence", "thus", "likewise"] },
  { q: "Writing · Rewrite with inversion: «I had never seen such chaos.» → Never ___ such chaos. (3 words)", a: ["had i seen"] },
  { q: "Writing · Complete: It is crucial that the committee ___ (review) the proposal. (one word)", a: ["review"] },
  { q: "Writing · Choose the sentence that avoids repetition best:", o: ["The study, which lasted two years, involved 500 participants.", "The study lasted two years. The study involved 500 participants.", "The study lasted two years and the study involved 500 participants.", "Lasting two years the study, the study involved 500."] },
  { q: "Writing · Choose the correct nominalisation: «The economy grew rapidly.» →", o: ["The rapid growth of the economy", "The rapidly grow of the economy", "The economy's rapid growing up", "The growth rapid of economy"] },
]);

// ======================= READING =======================
passages("en.r.a1", [
  { title: "My family", text: "Hi! My name is Daniela. I am fourteen years old and I live in Ibarra with my family. My father is a doctor and my mother is a teacher. I have one brother. His name is Martín and he is ten. We have a dog called Toby. On Saturdays we go to the park and play with Toby.",
    qs: [
      { q: "How old is Daniela?", o: ["14", "10", "40", "4"] },
      { q: "What is her mother's job?", o: ["Teacher", "Doctor", "Student", "Nurse"] },
      { q: "What do they do on Saturdays?", o: ["They go to the park", "They go to school", "They visit the doctor", "They stay at home"] },
    ] },
  { title: "A day at school", text: "Tom gets up at six thirty. He has breakfast with his sister and walks to school. Classes start at seven. His favourite subject is science because he likes experiments. He doesn't like history. At one o'clock he goes home and has lunch.",
    qs: [
      { q: "How does Tom go to school?", o: ["He walks", "By bus", "By car", "By bike"] },
      { q: "What is his favourite subject?", o: ["Science", "History", "English", "Maths"] },
      { q: "Tom likes history.", o: ["False", "True"] },
    ] },
  { title: "The market", text: "Every Saturday there is a big market in Otavalo. People sell clothes, fruit, vegetables and beautiful handicrafts. Many tourists visit the market. Carla goes with her grandmother. They buy bananas, potatoes and cheese. Carla always buys a new bracelet.",
    qs: [
      { q: "When is the market?", o: ["On Saturdays", "On Sundays", "Every day", "On Fridays"] },
      { q: "Who goes with Carla?", o: ["Her grandmother", "Her mother", "A tourist", "Her friend"] },
      { q: "What does Carla always buy?", o: ["A bracelet", "Cheese", "Clothes", "Bananas"] },
    ] },
]);
passages("en.r.a2", [
  { title: "A trip to the coast", text: "Last summer, Andrés travelled to Montañita with three friends. They took a bus from Quito and the journey lasted almost ten hours. On the first day, they had surfing lessons, but Andrés fell into the water many times. The next day the weather was bad, so they visited a small museum. Andrés says it was the best holiday of his life and he wants to go back next year.",
    qs: [
      { q: "How did they travel?", o: ["By bus", "By plane", "By car", "By boat"] },
      { q: "Why did they visit a museum?", o: ["Because the weather was bad", "Because Andrés was ill", "Because it was free", "Because they were tired of surfing"] },
      { q: "What does Andrés want to do?", o: ["Go back next year", "Learn to swim", "Work in a museum", "Never surf again"] },
    ] },
  { title: "Job advertisement", text: "WANTED: Part-time assistant for a small café in the city centre. You must be 18 or older and you need to speak basic English. The job is from Friday to Sunday, 4 pm to 9 pm. Experience is not necessary — we will train you. Send your CV to cafe.sol@email.com before 30 March.",
    qs: [
      { q: "How many days a week is the job?", o: ["Three", "Five", "Two", "Seven"] },
      { q: "Do you need experience?", o: ["No, they will train you", "Yes, at least one year", "Only in cafés", "The text doesn't say"] },
      { q: "What is the deadline?", o: ["30 March", "4 pm", "Friday", "18 March"] },
    ] },
  { title: "Healthy habits", text: "Doctors say that teenagers need eight to ten hours of sleep every night. However, many students go to bed very late because they use their phones. Experts recommend turning off screens one hour before bed. It is also a good idea to do exercise during the day and to avoid drinks with caffeine in the evening.",
    qs: [
      { q: "How many hours of sleep do teenagers need?", o: ["8 to 10", "6 to 8", "10 to 12", "5"] },
      { q: "Why do many students go to bed late?", o: ["They use their phones", "They do exercise", "They drink milk", "They study"] },
      { q: "What should you avoid in the evening?", o: ["Drinks with caffeine", "Exercise", "Turning off screens", "Water"] },
    ] },
]);
passages("en.r.b1", [
  { title: "Learning online", text: "When the pandemic closed schools, millions of students had to learn online almost overnight. At first, many found it difficult to concentrate at home, and some didn't have a good internet connection. However, others discovered advantages: they could watch lessons again, study at their own pace and save time on transport. Today, many universities offer hybrid programmes that combine the best of both worlds.",
    qs: [
      { q: "What was a problem for some students?", o: ["A poor internet connection", "Too much transport", "Watching lessons again", "Hybrid programmes"] },
      { q: "Which was an advantage of learning online?", o: ["Studying at your own pace", "Meeting more friends", "Longer lessons", "No homework"] },
      { q: "The phrase «the best of both worlds» refers to:", o: ["Online and face-to-face learning", "Two different countries", "Students and teachers", "Schools and homes"] },
      { q: "The writer's attitude is mainly:", o: ["Balanced", "Very negative", "Angry", "Uninterested"] },
    ] },
  { title: "The Galápagos Islands", text: "The Galápagos Islands, about 1,000 kilometres off the coast of Ecuador, are famous for their unique wildlife. Charles Darwin visited them in 1835, and his observations helped him develop the theory of evolution. Today, around 97% of the land is a national park. Visitors must be accompanied by certified guides, and there are strict rules to protect the animals, such as keeping a distance of two metres.",
    qs: [
      { q: "Why are the islands famous?", o: ["For their unique wildlife", "For their big cities", "For their mountains", "For their beaches only"] },
      { q: "What did Darwin's observations help him do?", o: ["Develop a scientific theory", "Create a national park", "Find a new route", "Become a guide"] },
      { q: "What must visitors do?", o: ["Go with a certified guide", "Feed the animals", "Stay for two weeks", "Travel alone"] },
    ] },
  { title: "A volunteer experience", text: "Last year I spent two months volunteering at an animal shelter. I expected to spend my days playing with puppies, but the reality was different. I cleaned cages, prepared food and helped the vet. It was hard work, but I learned to be responsible and patient. The best moment was when a dog I had cared for was adopted by a lovely family.",
    qs: [
      { q: "What did the writer expect?", o: ["To play with puppies", "To clean cages", "To work with a vet", "To adopt a dog"] },
      { q: "What did the writer learn?", o: ["Responsibility and patience", "How to become a vet", "How to cook", "How to train dogs"] },
      { q: "What was the best moment?", o: ["When a dog was adopted", "When the work finished", "When the vet arrived", "When he got paid"] },
    ] },
]);
passages("en.r.b2", [
  { title: "The four-day week", text: "Several companies around the world have experimented with a four-day working week without reducing salaries. Supporters argue that employees become more productive, take fewer sick days and enjoy a better work–life balance. Critics, on the other hand, warn that the model may not suit every industry: hospitals and shops, for instance, need staff every day. Nevertheless, the results of recent trials have been encouraging enough for many firms to make the change permanent.",
    qs: [
      { q: "According to supporters, workers on a four-day week:", o: ["Take fewer sick days", "Earn more money", "Work longer hours", "Prefer working at weekends"] },
      { q: "Why do critics have doubts?", o: ["Some sectors need staff every day", "Salaries are too high", "Employees get bored", "Productivity always falls"] },
      { q: "The word «encouraging» suggests the results were:", o: ["Positive", "Disappointing", "Confusing", "Expensive"] },
      { q: "What is the main purpose of the text?", o: ["To present arguments for and against an idea", "To advertise a company", "To tell a personal story", "To give instructions"] },
    ] },
  { title: "Fast fashion", text: "Fast fashion brands produce trendy clothes at low prices, encouraging consumers to buy more and more often. The environmental cost, however, is significant: the textile industry consumes huge amounts of water and is responsible for a considerable share of global emissions. In response, a growing number of consumers are turning to second-hand shops, clothes swaps and repair services. Whether this trend will be enough to change the industry remains to be seen.",
    qs: [
      { q: "What does fast fashion encourage?", o: ["Buying clothes more often", "Repairing clothes", "Saving water", "Buying second-hand"] },
      { q: "«Remains to be seen» means that:", o: ["It is not yet known", "It is clearly visible", "It has already happened", "It will never happen"] },
      { q: "Which is presented as an alternative to fast fashion?", o: ["Clothes swaps", "Buying online", "Cheaper brands", "Using less water at home"] },
    ] },
  { title: "Bilingual brains", text: "Research suggests that speaking two languages may offer cognitive benefits. Bilingual people constantly switch between languages, which appears to train the brain's ability to focus and ignore distractions. Some studies have even linked bilingualism to a later onset of dementia symptoms. Researchers stress, however, that the evidence is mixed and that the benefits depend on how frequently both languages are used.",
    qs: [
      { q: "What skill may bilingualism train?", o: ["Focusing and ignoring distractions", "Memorising numbers", "Speaking faster", "Writing better essays"] },
      { q: "What do researchers stress?", o: ["The evidence is not conclusive", "Bilingualism prevents dementia", "Only children benefit", "Two languages are confusing"] },
      { q: "The benefits depend on:", o: ["How often both languages are used", "The age of the person", "Which languages are spoken", "Living abroad"] },
    ] },
]);
passages("en.r.c1", [
  { title: "The attention economy", text: "In the so-called attention economy, human focus has become a scarce commodity for which technology companies compete relentlessly. Platforms are engineered to maximise engagement through infinite scrolling, variable rewards and personalised notifications — techniques borrowed, critics argue, from the gambling industry. While users ostensibly receive free services, they arguably pay with something more valuable: their time and, ultimately, their capacity for sustained thought. Advocates of 'digital minimalism' contend that reclaiming attention requires not mere willpower but a deliberate redesign of one's relationship with technology.",
    qs: [
      { q: "The writer suggests that 'free' services are paid for with:", o: ["Users' time and attention", "Hidden subscription fees", "Personal savings", "Advertising revenue"] },
      { q: "The word «ostensibly» implies that something is:", o: ["Apparently true but perhaps not really", "Definitely true", "Illegal", "Openly criticised"] },
      { q: "According to advocates of digital minimalism, reclaiming attention requires:", o: ["A deliberate redesign of habits", "Stronger willpower alone", "Banning social media", "Using more notifications"] },
      { q: "The comparison with the gambling industry is used to:", o: ["Highlight manipulative design", "Praise technology companies", "Explain how gambling works", "Suggest platforms are illegal"] },
    ] },
  { title: "Urban heat islands", text: "Cities are often several degrees warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. Asphalt and concrete absorb solar radiation during the day and release it slowly at night, while the scarcity of vegetation deprives cities of the cooling effect of evapotranspiration. Municipal authorities are increasingly experimenting with green roofs, reflective pavements and urban forests. Such measures, though costly, may prove indispensable as heatwaves become more frequent and intense.",
    qs: [
      { q: "What contributes to the heat island effect?", o: ["Materials that store heat and lack of vegetation", "Strong winds", "Too many parks", "High altitude"] },
      { q: "The word «indispensable» is closest in meaning to:", o: ["Essential", "Expensive", "Optional", "Temporary"] },
      { q: "The writer's view of the measures is that they are:", o: ["Expensive but probably necessary", "Useless", "Cheap and easy", "Already sufficient"] },
    ] },
]);

// ---------- Lecturas adicionales ----------
passages("en.r.a1.x", [
  { title: "My bedroom", text: "My bedroom is small but I love it. There is a bed, a desk and a big window. My computer is on the desk. There are posters of my favourite band on the walls. My cat, Luna, sleeps on my bed every night.",
    qs: [
      { q: "Is the bedroom big?", o: ["No, it's small", "Yes, it's very big", "It's medium", "The text doesn't say"] },
      { q: "Where is the computer?", o: ["On the desk", "On the bed", "Under the window", "On the wall"] },
      { q: "Who is Luna?", o: ["A cat", "A sister", "A singer", "A friend"] },
    ] },
  { title: "Weekend plans", text: "Hi Sara! Do you want to come to my house on Sunday? My mum is making lasagne for lunch. After lunch we can watch a film or play video games. My house is next to the supermarket on Bolívar Street. Come at twelve o'clock. Bye! — Kevin",
    qs: [
      { q: "When is the invitation for?", o: ["Sunday", "Saturday", "Monday", "Friday"] },
      { q: "What is Kevin's mum making?", o: ["Lasagne", "Pizza", "Soup", "A cake"] },
      { q: "Where is Kevin's house?", o: ["Next to the supermarket", "Next to the school", "Behind the park", "In the city centre"] },
    ] },
  { title: "Animals of Ecuador", text: "Ecuador has many amazing animals. The Andean condor is a very big bird. It lives in the mountains. In the Galápagos Islands there are giant tortoises. They are very old — some are more than 100 years old! In the Amazon there are colourful parrots and monkeys.",
    qs: [
      { q: "Where does the Andean condor live?", o: ["In the mountains", "In the sea", "In the Amazon", "In the city"] },
      { q: "Some giant tortoises are more than…", o: ["100 years old", "10 years old", "1,000 years old", "50 kilos"] },
      { q: "Which animals live in the Amazon, according to the text?", o: ["Parrots and monkeys", "Condors and tortoises", "Penguins", "Sharks"] },
    ] },
]);
passages("en.r.a2.x", [
  { title: "A message from the school", text: "Dear parents, next Friday, 12 May, there will be no classes because teachers have a training day. On Saturday, 13 May, the school is organising a sports festival from 9 am to 2 pm. Students should bring water, a hat and sun cream. Food will be available at the school café. Families are welcome!",
    qs: [
      { q: "Why are there no classes on Friday?", o: ["Teachers have training", "It's a holiday", "There's a sports festival", "The school is closed for repairs"] },
      { q: "What should students bring to the festival?", o: ["Water, a hat and sun cream", "Food and money", "Books", "Their parents' ID"] },
      { q: "How long does the festival last?", o: ["Five hours", "Two hours", "All day", "Nine hours"] },
    ] },
  { title: "My first job", text: "When I was sixteen, I got my first job in my uncle's bakery. I worked every Saturday from six in the morning. At first it was difficult to wake up so early, but I soon got used to it. I learned how to make bread and how to talk to customers. With my first salary I bought a new pair of trainers.",
    qs: [
      { q: "Where did the writer work?", o: ["In a bakery", "In a shoe shop", "In a school", "In a supermarket"] },
      { q: "What was difficult at first?", o: ["Waking up early", "Making bread", "Talking to customers", "Getting paid"] },
      { q: "What did the writer buy?", o: ["Trainers", "Bread", "A phone", "Clothes for his uncle"] },
    ] },
  { title: "Cuenca", text: "Cuenca is the third biggest city in Ecuador. Its old town has beautiful churches, colonial houses and narrow streets, and it is a UNESCO World Heritage Site. Many foreigners decide to live in Cuenca because the weather is mild and life is quieter than in big cities. Near the city, visitors can go hiking in Cajas National Park.",
    qs: [
      { q: "Why do many foreigners live in Cuenca?", o: ["Mild weather and a quieter life", "It's the capital", "It's by the sea", "There are many jobs"] },
      { q: "What can you do in Cajas National Park?", o: ["Go hiking", "Go surfing", "Visit churches", "Go shopping"] },
      { q: "What is special about Cuenca's old town?", o: ["It's a World Heritage Site", "It's very modern", "It has big avenues", "It's the oldest in the world"] },
    ] },
]);
passages("en.r.b1.x", [
  { title: "Coffee from Ecuador", text: "Although Ecuador is better known for its bananas and cocoa, its coffee is gaining international recognition. Small farmers in Loja and Zamora Chinchipe grow coffee at high altitudes, which produces beans with complex flavours. In recent years, several Ecuadorian coffees have won prizes in international competitions. Experts believe that if farmers continue investing in quality rather than quantity, the industry could grow considerably.",
    qs: [
      { q: "What is the text mainly about?", o: ["The growing reputation of Ecuadorian coffee", "Banana exports", "How to make coffee", "Coffee prices"] },
      { q: "Why does high-altitude coffee taste special?", o: ["The beans develop complex flavours", "It is cheaper", "It grows faster", "It contains more caffeine"] },
      { q: "According to experts, the industry could grow if farmers:", o: ["Focus on quality", "Produce more coffee", "Stop growing cocoa", "Move to the coast"] },
    ] },
  { title: "Should homework be banned?", text: "Some schools have decided to eliminate homework for younger students. They argue that children need time to play, rest and spend time with their families. Others disagree, saying that homework teaches responsibility and helps students practise what they learned in class. A possible solution is to give less homework but make it more meaningful, such as reading for pleasure or small research projects.",
    qs: [
      { q: "Why do some schools eliminate homework?", o: ["Children need time to play and rest", "Teachers are too busy", "Parents complain", "Students don't learn anything"] },
      { q: "What is one argument in favour of homework?", o: ["It teaches responsibility", "It is fun", "It replaces classes", "It reduces stress"] },
      { q: "What solution does the writer suggest?", o: ["Less but more meaningful homework", "No homework at all", "More homework", "Only exams"] },
    ] },
  { title: "Lost in the city", text: "When Mariana moved to Quito for university, she got lost on her first day. Her phone battery died, so she couldn't use the map. She decided to ask a woman at a bus stop for directions. Not only did the woman explain which bus to take, but she also travelled with Mariana to make sure she arrived safely. Mariana still remembers that act of kindness.",
    qs: [
      { q: "Why couldn't Mariana use the map?", o: ["Her phone battery died", "She didn't have a phone", "There was no signal", "She couldn't read it"] },
      { q: "What did the woman do?", o: ["Travelled with Mariana", "Called a taxi", "Gave her money", "Lent her a phone"] },
      { q: "What is the main idea of the story?", o: ["A stranger's kindness", "How to use maps", "Problems with buses", "University life"] },
    ] },
]);
passages("en.r.b2.x", [
  { title: "Remote work and small towns", text: "The rise of remote work has allowed many professionals to leave crowded capitals and settle in smaller towns. Local economies have benefited from new residents with higher incomes, yet the change has also driven up housing prices, making it harder for long-time residents to afford rent. Urban planners argue that towns must anticipate these effects by investing in infrastructure and affordable housing before the newcomers arrive.",
    qs: [
      { q: "What is a negative consequence mentioned?", o: ["Housing has become more expensive", "Local businesses closed", "Internet got slower", "Crime increased"] },
      { q: "The word «yet» introduces:", o: ["A contrast", "An example", "A conclusion", "A time reference"] },
      { q: "What do urban planners recommend?", o: ["Planning ahead with infrastructure and housing", "Banning remote work", "Stopping newcomers", "Raising rents"] },
    ] },
  { title: "The science of habits", text: "Habits are formed through a loop of three elements: a cue, a routine and a reward. When we repeat this loop, the behaviour becomes automatic and requires little conscious effort. To build a new habit, experts suggest making the cue obvious and the reward immediate — for instance, leaving your running shoes by the door and enjoying a smoothie after exercising. Breaking a bad habit, conversely, often involves making the cue invisible.",
    qs: [
      { q: "What are the three elements of the habit loop?", o: ["Cue, routine and reward", "Effort, time and motivation", "Goal, plan and result", "Morning, afternoon and night"] },
      { q: "Leaving running shoes by the door is an example of:", o: ["Making the cue obvious", "A reward", "Breaking a habit", "A routine"] },
      { q: "«Conversely» is closest in meaning to:", o: ["On the other hand", "As a result", "For example", "In addition"] },
    ] },
  { title: "Volcano monitoring", text: "Ecuador has dozens of volcanoes, several of which are active, including Cotopaxi and Tungurahua. Scientists at the Instituto Geofísico continuously monitor seismic activity, gas emissions and ground deformation to detect signs of a possible eruption. Although eruptions cannot be predicted with total precision, early warnings have allowed authorities to evacuate communities in time and save lives.",
    qs: [
      { q: "What do scientists monitor?", o: ["Seismic activity, gases and ground deformation", "Only the temperature", "Tourist numbers", "Rainfall"] },
      { q: "According to the text, eruptions:", o: ["Cannot be predicted with total precision", "Are always predicted exactly", "Never happen in Ecuador", "Are not dangerous"] },
      { q: "What has made it possible to save lives?", o: ["Early warnings and evacuation", "Building walls", "Stopping eruptions", "Moving volcanoes"] },
    ] },
]);
passages("en.r.c1.x", [
  { title: "The paradox of choice", text: "Conventional wisdom holds that more choice leads to greater satisfaction. Yet psychologists have documented what they term the 'paradox of choice': when confronted with an overwhelming array of options, consumers frequently experience anxiety, defer decisions or, having chosen, feel less content with their selection. The phenomenon is attributed partly to heightened expectations and partly to the anticipated regret of forgoing alternatives.",
    qs: [
      { q: "The 'paradox of choice' suggests that too many options can:", o: ["Reduce satisfaction", "Always increase happiness", "Make products cheaper", "Simplify decisions"] },
      { q: "«Defer» is closest in meaning to:", o: ["Postpone", "Refuse", "Accelerate", "Celebrate"] },
      { q: "Which is given as a cause of the phenomenon?", o: ["Anticipated regret", "Lack of information", "Low prices", "Advertising bans"] },
    ] },
  { title: "Translating poetry", text: "Translating poetry has long been regarded as the most demanding of linguistic tasks. Whereas a technical manual may be rendered with reasonable fidelity, a poem's meaning is inseparable from its sound, rhythm and cultural resonance. Translators are therefore compelled to make painful trade-offs: preserving the rhyme may require sacrificing literal meaning, while a literal rendering may strip the poem of its music. Some scholars argue that a successful translation is less a copy than a new poem in its own right.",
    qs: [
      { q: "Why is poetry particularly hard to translate?", o: ["Meaning depends on sound and culture", "Poems are too long", "Poets use technical vocabulary", "There are few translators"] },
      { q: "The 'trade-offs' mentioned involve choosing between:", o: ["Form and literal meaning", "Speed and cost", "Old and new poems", "Authors and readers"] },
      { q: "Some scholars view a successful translation as:", o: ["A new poem in its own right", "An exact copy", "A technical manual", "A failure by definition"] },
    ] },
  { title: "Microplastics", text: "Microplastics — fragments smaller than five millimetres — have been detected everywhere from Arctic ice to human blood. While their long-term health effects remain under investigation, preliminary studies have raised concerns about inflammation and the transport of toxic chemicals that adhere to their surfaces. Tackling the problem, researchers contend, will require intervention at source: redesigning products, curbing single-use plastics and improving wastewater filtration, rather than relying solely on clean-up efforts.",
    qs: [
      { q: "What do we know about the long-term health effects?", o: ["They are still being investigated", "They are proven harmless", "They cause certain death", "They only affect animals"] },
      { q: "«Curbing» is closest in meaning to:", o: ["Limiting", "Promoting", "Recycling", "Measuring"] },
      { q: "Researchers believe the solution lies mainly in:", o: ["Acting at the source", "Clean-up campaigns only", "Studying Arctic ice", "Producing more filters for homes"] },
    ] },
  { title: "Sleep and productivity", text: "In many corporate cultures, sleep deprivation is worn as a badge of honour, a sign of dedication and ambition. Mounting evidence, however, paints a starkly different picture: chronic lack of sleep impairs judgement, creativity and emotional regulation, to the extent that a sleep-deprived employee may perform comparably to someone who is mildly intoxicated. Forward-thinking companies are consequently reconsidering long-hours cultures, recognising that rest is not the antithesis of productivity but its prerequisite.",
    qs: [
      { q: "In some corporate cultures, lack of sleep is seen as:", o: ["A sign of dedication", "A health problem", "A reason for dismissal", "A sign of laziness"] },
      { q: "The writer compares a sleep-deprived worker to someone who is:", o: ["Mildly intoxicated", "Highly creative", "On holiday", "Very ambitious"] },
      { q: "The final sentence suggests that rest is:", o: ["Necessary for productivity", "The opposite of productivity", "A waste of time", "Only for weekends"] },
    ] },
]);

// ---------- Más gramática ----------
bank("en.g.a1.x", [
  { q: "What time ___ it?", o: ["is", "are", "does", "do"] },
  { q: "I like ___ to music.", o: ["listening", "listen to", "listens", "listened"] },
  { q: "___ your sister like chocolate?", o: ["Does", "Do", "Is", "Are"] },
  { q: "My house is ___ the bank and the school. (entre)", o: ["between", "next", "under", "on"] },
  { q: "They ___ watching TV now.", o: ["are", "is", "am", "be"] },
  { q: "Whose book is this? — It's ___ .", o: ["mine", "my", "me", "I"] },
  { q: "There ___ a lot of water in the bottle.", o: ["is", "are", "have", "has"] },
  { q: "I ___ swim, but I can ride a bike.", o: ["can't", "don't", "am not", "doesn't"] },
]);
bank("en.g.a2.x", [
  { q: "I didn't go out because it ___ raining.", o: ["was", "were", "is", "has"] },
  { q: "This is the ___ film I've ever seen.", o: ["worst", "baddest", "worse", "most bad"] },
  { q: "We ___ dinner when the lights went out.", o: ["were having", "had", "have", "are having"] },
  { q: "You ___ bring food. There is a café. (no es necesario)", o: ["don't have to", "mustn't", "can't", "have to"] },
  { q: "How ___ does the ticket cost?", o: ["much", "many", "long", "far"] },
  { q: "I think it ___ rain tomorrow.", o: ["will", "is", "does", "going"] },
  { q: "She has ___ finished her homework. (ya)", o: ["already", "yet", "ever", "still"] },
  { q: "I've had this phone ___ two years.", o: ["for", "since", "ago", "from"] },
]);
