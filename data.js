'use strict';
/* FluentPath — content: placement bank, grammar units, vocabulary.
   Exercise DSL:  mc|prompt with ___|opt;opt;opt|correctIndex|why
                  type|prompt with ___|answer/alt answer|why
                  ord|the correct sentence|alt order~alt order                                   */

/* ===== Placement bank — d = difficulty on the CEFR scale (A1=0 … C1=4) ===== */
const PLACEMENT = [];
const pq = (d, skill, dsl, passage) => { const it = FP.parse(dsl); it.d = d; it.skill = skill; if (passage) it.passage = passage; it.id = 'p' + PLACEMENT.length; PLACEMENT.push(it); };

// A1
pq(0, 'grammar', 'mc|She ___ a teacher.|is;am;are|0');
pq(0, 'grammar', 'mc|I ___ from Sri Lanka.|am;is;are|0');
pq(0, 'grammar', 'mc|We ___ two brothers.|have;has;having|0');
pq(0, 'vocab', 'mc|I drink ___ every morning.|tea;chair;door|0');
pq(0.1, 'grammar', 'mc|___ is your name?|What;Where;Who|0');
pq(0.2, 'build', 'ord|I like to play cricket.');
pq(0.3, 'grammar', 'mc|He ___ breakfast at seven.|eats;eat;eating|0');
pq(0.2, 'vocab', "mc|The opposite of 'big' is ___.|small;tall;old|0");
pq(0.4, 'grammar', 'mc|There ___ three books on the table.|are;is;am|0');
pq(0.1, 'reading', "mc|What is the dog's name?|Anna;Max;Garden|1", "Anna is ten years old. She has a dog. The dog's name is Max. Max likes to play in the garden.");
// A2
pq(1, 'grammar', 'mc|I ___ to the cinema yesterday.|went;go;goed;going|0');
pq(1, 'grammar', 'mc|She is ___ than her sister.|taller;tallest;more tall;most tall|0');
pq(1.2, 'grammar', 'mc|How ___ water do you drink every day?|much;many;several;lot|0');
pq(1, 'grammar', "mc|I'm going to ___ my grandparents next week.|visit;visiting;visited;visits|0");
pq(1, 'vocab', 'mc|Please tell me where to ___ the bus.|get off;get in;take out;go off|0');
pq(1.3, 'grammar', 'mc|If it rains, we ___ at home.|will stay;stay will;would stay;stayed|0');
pq(1.2, 'build', "ord|She didn't go to school yesterday because she was ill.");
pq(1, 'grammar', "mc|There isn't ___ milk in the fridge.|any;some;a;many|0");
pq(1.1, 'vocab', 'mc|My brother is very ___. He never stops talking.|talkative;quiet;shy;silent|0');
pq(1.6, 'grammar', 'mc|Have you ___ been to London?|ever;never;yet;since|0');
pq(1.2, 'vocab', 'mc|The film was so ___ that I fell asleep.|boring;bored;bore;bores|0');
pq(1.1, 'reading', 'mc|When does Tom visit his grandmother?|On Sundays;On Saturdays;Every evening;At work|0', 'Tom works in a bookshop. On Saturdays he plays football with his friends. On Sundays he visits his grandmother, who lives near the park.');
// B1
pq(2, 'grammar', 'mc|I have lived here ___ 2015.|since;for;from;during|0');
pq(2, 'grammar', 'mc|If I ___ more money, I would travel the world.|had;have;will have;would have|0');
pq(2, 'grammar', 'mc|The window ___ by the boy yesterday.|was broken;broke;was broke;has broken|0');
pq(1.9, 'grammar', "mc|You ___ wear a seatbelt. It's the law.|must;could;may;would|0");
pq(2, 'grammar', 'mc|The man ___ lives next door is a doctor.|who;which;whose;where|0');
pq(2, 'vocab', 'mc|She decided to ___ her job and start her own business.|quit;cancel;refuse;ignore|0');
pq(2.1, 'grammar', 'mc|He suggested ___ to the beach.|going;to go;go;went|0');
pq(2.2, 'build', 'ord|If you want to pass the exam, you should study every day.');
pq(2.5, 'grammar', 'mc|By the time we arrived, the film ___.|had already started;already started;has already started;was already start|0');
pq(2, 'vocab', 'mc|The company is going to ___ a new product next month.|launch;lunch;lend;lead|0');
pq(2.4, 'grammar', "mc|I'm not used to ___ up so early.|getting;get;got;be getting|0");
pq(2.4, 'grammar', 'mc|She asked me where ___.|I was going;was I going;I am going;did I go|0');
pq(1.9, 'grammar', 'mc|She is good ___ mathematics.|at;in;on;for|0');
pq(2, 'reading', 'mc|What is the main idea of the passage?|Working from home has both advantages and disadvantages.;Everyone prefers working at the office.;Companies want all staff to work from home.;Travelling to work is enjoyable.|0', 'Working from home has become common. Many employees say they save time because they do not need to travel, and they feel more relaxed. However, some workers report feeling lonely and find it difficult to separate work from family life. Companies are now looking for a balance, asking staff to come to the office two or three days a week.');
pq(2.5, 'reading', 'mc|What can be inferred from the passage?|Community action helped the library survive.;The library closed last year.;The council pays the volunteers.;Few people use the library now.|0', "Although the town's library was almost closed last year, local residents organised a campaign to save it. Volunteers now run children's reading sessions and computer classes, and the number of visitors has doubled.");
// B2
pq(3, 'grammar', 'mc|If I had known about the traffic, I ___ earlier.|would have left;would leave;had left;left|0');
pq(3, 'grammar', 'mc|I wish I ___ more time to study last week.|had had;have;had;would have|0');
pq(3, 'grammar', 'mc|He denied ___ the money.|taking;to take;take;took|0');
pq(3.1, 'grammar', 'mc|The report ___ by the end of the week.|will have been completed;will complete;is completing;has completed|0');
pq(3, 'grammar', "mc|She must ___ the message; she hasn't replied.|have missed;miss;be missed;had miss|0");
pq(3, 'vocab', 'mc|The government is under pressure to ___ unemployment.|tackle;repair;cure;mend|0');
pq(3.4, 'grammar', 'mc|Not only ___ late, but he also forgot the documents.|did he arrive;he arrived;arrived he;he did arrive|0');
pq(3, 'grammar', 'mc|The man, ___ car was stolen, called the police.|whose;who;which;whom|0');
pq(3.5, 'build', 'ord|Had I realised the danger, I would never have gone there.');
pq(3.1, 'grammar', "mc|I'd rather you ___ smoke in here.|didn't;don't;wouldn't;haven't|0");
pq(3.2, 'grammar', "mc|It's high time we ___ a decision.|made;make;will make;are making|0");
pq(3, 'vocab', 'mc|Their results were ___ with ours — nearly identical.|consistent;insistent;resistant;constant|0');
pq(3.1, 'grammar', 'mc|She is said ___ the best surgeon in the country.|to be;being;to being;that is|0');
pq(3.6, 'grammar', 'mc|Which sentence is correct?|Hardly had he sat down when the phone rang.;Hardly he had sat down when the phone rang.;Hardly had he sat down than the phone rang.;Hardly he sat down when the phone rang.|0');
pq(2.6, 'reading', 'mc|According to the passage, trees can ___.|lower summer temperatures;increase stress;raise land prices;attract planners|0', 'Urban green spaces do more than make cities attractive. Studies suggest that residents living near parks report lower stress, and trees can reduce summer temperatures by several degrees. Nevertheless, planners often view parks as a luxury, sacrificing them when land becomes expensive.');
pq(3.2, 'reading', "mc|What is the writer's attitude towards planners?|Critical of their short-sighted priorities;Admiring of their creativity;Neutral about their decisions;Surprised by their generosity|0", 'Urban green spaces do more than make cities attractive. Studies suggest that residents living near parks report lower stress, and trees can reduce summer temperatures by several degrees. Nevertheless, planners often view parks as a luxury, sacrificing them when land becomes expensive.');
// C1
pq(4, 'grammar', 'mc|Seldom ___ such a beautiful sunset.|have I seen;I have seen;did I saw;I saw|0');
pq(4, 'grammar', 'mc|Had it not been for your help, I ___ the deadline.|would have missed;would miss;will miss;missed|0');
pq(3.9, 'grammar', "mc|What I really need ___ a long holiday.|is;are;being;has|0");
pq(4, 'vocab', "mc|The CEO's remarks were deliberately ___, allowing different interpretations.|ambiguous;ambient;amicable;abundant|0");
pq(4, 'vocab', 'mc|The scandal ___ the reputation of the entire organisation.|tarnished;tamed;tailored;tackled|0');
pq(4.1, 'grammar', 'mc|No sooner ___ the door than the alarm went off.|had she opened;she had opened;did she open;she opened|0');
pq(4, 'grammar', 'mc|The proposal, ___ initially welcomed, was later abandoned.|although;despite;in spite;however|0');
pq(4, 'grammar', 'mc|He is reputed ___ a fortune from the deal.|to have made;to make;making;that made|0');
pq(4.2, 'build', 'ord|Scarcely had the meeting begun when the power went out.');
pq(4, 'vocab', 'mc|The new regulations are intended to ___ the risk of fraud.|mitigate;mutate;mimic;magnify|0');
pq(4, 'grammar', "mc|I'd sooner you ___ the matter with her yourself.|discussed;discuss;will discuss;had discuss|0");
pq(4, 'grammar', 'mc|It was not until she left ___ she realised her mistake.|that;when;then;as|0');
pq(4.1, 'reading', 'mc|What does the writer imply?|Innovation requires careful consideration of who benefits.;Technology should be abandoned.;Populist movements are justified.;Productivity has not increased.|0', 'The notion that technological progress inevitably yields social benefit has been repeatedly challenged. While automation has undoubtedly boosted productivity, its gains have been unevenly distributed, and the displacement of routine jobs has fuelled precisely the resentment that populist movements exploit. To treat innovation as inherently benign is, therefore, to ignore history.');
pq(4, 'vocab', "mc|In the last sentence, 'benign' is closest in meaning to ___.|harmless;generous;ordinary;weak|0", 'The notion that technological progress inevitably yields social benefit has been repeatedly challenged. While automation has undoubtedly boosted productivity, its gains have been unevenly distributed, and the displacement of routine jobs has fuelled precisely the resentment that populist movements exploit. To treat innovation as inherently benign is, therefore, to ignore history.');

/* ===== Grammar units ===== */
const UNITS = [];
const U = (id, lvl, icon, title, rule, examples, ex) => UNITS.push({ id, lvl, icon, title, rule, examples, ex: ex.map(FP.parse) });

/* ---- A1 ---- */
U('be', 0, '🧍', 'To be: am / is / are', 'Use <b>am / is / are</b> to say who or what someone is. <b>I → am</b>, <b>he / she / it → is</b>, <b>you / we / they → are</b>. For a negative add <b>not</b>; for a question, put the verb first.',
  ['I am a student.', 'She is happy.', 'They are at home.', "He isn't tired. · Are you ready?"], [
  'mc|My brother ___ twenty years old.|am;is;are|1|My brother = he → is.',
  'mc|___ you from India?|Is;Are;Am|1|You → Are.',
  'mc|We ___ not late today.|is;am;are|2|We → are.',
  'type|I ___ (be) hungry.|am|I → am.',
  'ord|They are very good friends.',
  'mc|The books ___ on the desk.|is;are;am|1|Books is plural → are.']);
U('presimple', 0, '☀️', 'Present simple', 'Use the present simple for <b>habits and facts</b>. Add <b>-s / -es</b> for he / she / it. Use <b>do / does</b> for questions and <b>don\'t / doesn\'t</b> for negatives — and then the main verb has <b>no -s</b>.',
  ['She drinks tea every morning.', 'They don\'t like spicy food.', 'Does he play tennis?', 'Water boils at 100 °C.'], [
  'mc|She ___ coffee every morning.|drink;drinks;drinking|1|She → drinks.',
  'mc|___ he play tennis?|Do;Does;Is|1|With he / she / it use Does.',
  "mc|They ___ like spicy food.|doesn't;don't;isn't|1|They → don't.",
  'type|My father ___ (work) in a bank.|works|He / she / it → add -s.',
  'ord|I usually get up at six o\'clock.',
  'mc|Water ___ at 100 degrees.|boil;boils;boiling|1|A fact with “water” (it) → boils.']);
U('thereis', 0, '📍', 'There is / There are', 'Use <b>there is</b> for one thing (or something uncountable) and <b>there are</b> for more than one. Use <b>a / an</b> with singular, <b>some</b> in positive sentences and <b>any</b> in questions and negatives.',
  ['There is a cat under the table.', 'There are two bedrooms.', 'Is there any milk?', "There aren't any eggs."], [
  'mc|There ___ a cat under the table.|is;are;have|0|One cat → is.',
  'mc|There ___ many people in the park.|is;are;has|1|Many people → are.',
  'mc|Is there ___ milk in the glass?|any;a;many|0|Questions use any with uncountable nouns.',
  "type|There ___ (not / be) any eggs left.|aren't/are not|Eggs is plural → aren't.",
  'ord|There are two bedrooms in my house.',
  'mc|There ___ an apple on the plate.|is;are;am|0|An apple is singular → is.']);
U('can', 0, '💪', 'Can / can\'t', 'Use <b>can</b> for ability and permission. After <b>can</b> the verb has <b>no -s and no “to”</b>. The negative is <b>can\'t</b> (or cannot).',
  ['She can speak three languages.', 'I can\'t come to the party.', 'Can you help me?', 'Penguins can\'t fly.'], [
  'mc|She ___ speak three languages.|can;cans;is can|0|Can never takes -s.',
  'mc|___ you swim?|Can;Do;Are|0|Questions: Can + subject + verb.',
  "mc|I ___ come to the party. I'm busy.|can't;can;cans|0|Busy → can't.",
  'type|He can ___ (run) very fast.|run|After can, use the base verb.',
  'ord|Can you help me with this exercise?',
  "mc|Penguins are birds, but they ___ fly.|can't;can;cans|0|Penguins cannot fly."]);

/* ---- A2 ---- */
U('pastsimple', 1, '⏪', 'Past simple', 'Use the past simple for <b>finished actions</b>. Regular verbs add <b>-ed</b>; many common verbs are irregular (go → went, see → saw, buy → bought). For questions and negatives use <b>did / didn\'t</b> + the base verb.',
  ['We saw a great film last night.', 'She didn\'t come to the party.', 'Did you enjoy the trip?', 'They went to Kandy in 2019.'], [
  'mc|We ___ a great film last night.|see;saw;seen|1|Irregular: see → saw.',
  "mc|She ___ come to the party.|didn't;doesn't;not|0|Past negative: didn't + base verb.",
  'mc|___ you enjoy the trip?|Did;Do;Were|0|Past question: Did + subject + base verb.',
  'type|He ___ (buy) a new phone last week.|bought|Irregular: buy → bought.',
  'type|They ___ (go) to Kandy in 2019.|went|Irregular: go → went.',
  "ord|I didn't finish my homework yesterday."]);
U('presentcont', 1, '🎬', 'Present continuous vs present simple', 'Use the <b>present continuous (am / is / are + -ing)</b> for things happening <b>now</b> or around now. Use the <b>present simple</b> for habits, routines and facts.',
  ['Be quiet! The baby is sleeping.', 'I go to school by bus every day.', 'Look! It is raining.', 'She doesn\'t eat meat.'], [
  'mc|Be quiet! The baby ___.|sleeps;is sleeping;sleeping|1|Happening right now → continuous.',
  'mc|I ___ to school by bus every day.|go;am going;goes|0|Daily routine → present simple.',
  'mc|Look! It ___ outside.|rains;is raining;rain|1|“Look!” → happening now.',
  "mc|She ___ meat. She's vegetarian.|doesn't eat;isn't eating;don't eat|0|A permanent fact → present simple.",
  'type|Right now, they (watch) ___ TV.|are watching|Now → am / is / are + -ing.',
  'ord|What are you doing at the moment?']);
U('compare', 1, '📏', 'Comparatives and superlatives', 'Short adjectives: <b>-er / -est</b> (cheap → cheaper → the cheapest). Long adjectives: <b>more / the most</b> (interesting → more interesting → the most interesting). Use <b>than</b> to compare two things. Irregular: good → better → best.',
  ['This phone is cheaper than that one.', 'She is the smartest student.', 'Colombo is more crowded than Galle.', 'It is the most interesting book I\'ve read.'], [
  'mc|This phone is ___ than that one.|cheaper;more cheap;cheapest|0|Short adjective + -er + than.',
  'mc|She is the ___ student in our class.|smartest;smarter;most smart|0|“The” + -est for the top of a group.',
  'mc|Colombo is ___ crowded than Galle.|more;most;much|0|Long adjective → more … than.',
  'type|Today is (hot) ___ than yesterday.|hotter|Double the final consonant: hot → hotter.',
  'mc|This is the ___ book I\'ve ever read.|most interesting;more interesting;interestingest|0|Long adjective + superlative → the most.',
  'ord|He is not as tall as his brother.']);
U('future', 1, '🔮', 'Future: going to and will', 'Use <b>going to</b> for plans and for predictions based on evidence you can see. Use <b>will</b> for quick decisions, promises and opinions about the future (I think … will …).',
  ['Look at those clouds! It is going to rain.', 'I\'m cold. — I\'ll close the window.', 'We are going to travel to Japan next summer.', 'Don\'t worry. I will help you.'], [
  'mc|Look at those clouds! It ___ rain.|is going to;is;will to|0|Evidence you can see → going to.',
  "mc|I'm cold. — I ___ close the window.|'ll;am going to;going|0|A decision made at that moment → will.",
  "mc|We ___ to Japan next summer. We've booked the tickets.|are going to travel;travel will;will to travel|0|A plan already made → going to.",
  'type|I think she (pass) ___ the exam.|will pass|I think … → will.',
  'ord|I am going to start a new course next month.',
  "mc|Don't worry. I ___ help you.|will;going to;am|0|A promise → will."]);
U('quantity', 1, '🥛', 'Much, many, some, any, few, little', 'Use <b>many</b> with countable nouns and <b>much</b> with uncountable nouns (mostly in questions and negatives). <b>A few / a little</b> mean “some”; <b>few / little</b> mean “not enough”.',
  ['How much sugar do you want?', 'How many people are coming?', 'There are only a few chairs.', "We don't have any bread."], [
  'mc|How ___ sugar do you want?|much;many;few|0|Sugar is uncountable → much.',
  'mc|There are only ___ chairs in the room.|a few;a little;much|0|Chairs are countable → a few.',
  'mc|She has ___ friends in the city, so she feels lonely.|few;a few;little|0|“Few” = not enough, a negative idea.',
  'type|Would you like ___ tea? (some / any)|some|Offers use some.',
  "mc|We don't have ___ bread.|any;some;a|0|Negative → any.",
  'ord|How many people are coming to the party?']);

/* ---- B1 ---- */
U('perfect', 2, '🧭', 'Present perfect vs past simple', 'Use the <b>present perfect (have / has + past participle)</b> for experiences, results now, and situations that continue (<b>for / since</b>). Use the <b>past simple</b> with a finished time (yesterday, last year, in 2019).',
  ['I have lived here since 2020.', 'She went to Paris last summer.', 'Have you ever eaten sushi?', "We haven't finished the report yet."], [
  'mc|I ___ here since 2020.|have lived;lived;live|0|Since + a point in time, still true now → present perfect.',
  'mc|She ___ to Paris last summer.|went;has gone;has been|0|“Last summer” is finished time → past simple.',
  'mc|___ you ever eaten sushi?|Have;Did;Are|0|Life experience → Have you ever + past participle.',
  "mc|We ___ the report yet.|haven't finished;didn't finish;don't finish|0|“Yet” → present perfect.",
  'type|He ___ (live) in Canada for ten years. (He still lives there.)|has lived|Still true now → present perfect.',
  'ord|They have known each other since childhood.']);
U('conditionals', 2, '🔀', 'First and second conditionals', '<b>First conditional</b> (real, possible): <em>If + present simple, will + verb.</em> <b>Second conditional</b> (imaginary, unlikely): <em>If + past simple, would + verb.</em> In the second conditional, “If I were you…” is standard for advice.',
  ['If it rains tomorrow, we will cancel the trip.', 'If I won the lottery, I would buy a house.', 'If I were you, I would take the job.'], [
  "mc|If it ___ tomorrow, we'll cancel the trip.|rains;will rain;rained|0|First conditional: if + present simple.",
  'mc|If I ___ you, I would take the job.|were;am;will be|0|Advice: If I were you…',
  'mc|If she studies harder, she ___ the exam.|will pass;would pass;passed|0|Real possibility → will.',
  'type|If I (win) ___ the lottery, I would buy a house.|won|Second conditional: if + past simple.',
  'mc|What ___ you do if you lost your passport?|would;will;did|0|Imaginary → would.',
  'ord|If I had more time, I would learn Spanish.']);
U('modals', 2, '🚦', 'Obligation, advice and prohibition', '<b>should</b> = advice. <b>must / have to</b> = strong obligation. <b>mustn\'t</b> = forbidden. <b>don\'t have to</b> = not necessary (you may if you want). <b>should have + past participle</b> = a regret about the past.',
  ['You should see a doctor.', 'Students have to wear a uniform.', 'You mustn\'t park here.', 'You don\'t have to bring food.'], [
  'mc|You ___ see a doctor. You look very ill.|should;can;would|0|Advice → should.',
  "mc|Students ___ wear a uniform at our school. It's a rule.|have to;might;could|0|A rule → have to.",
  "mc|You ___ park here. It's forbidden.|mustn't;don't have to;shouldn't|0|Forbidden → mustn't.",
  "mc|You ___ bring food. We'll provide everything.|don't have to;mustn't;can't|0|Not necessary → don't have to.",
  "type|I think you (should / shouldn't) ___ drink so much coffee.|shouldn't|Advice against something → shouldn't.",
  'ord|You should have told me earlier.']);
U('passive', 2, '🔁', 'The passive voice', 'Use the passive when the <b>action is more important than who did it</b>. Form: <b>be + past participle</b>. Present: is / are made. Past: was / were made. Add <b>by …</b> only if the doer matters.',
  ['English is spoken in many countries.', 'The bridge was built in 1998.', 'These cars are made in Germany.', 'The letter was sent by the manager.'], [
  'mc|English ___ in many countries.|is spoken;speaks;is speak|0|Passive present: is + past participle.',
  'mc|The bridge ___ in 1998.|was built;built;is built|0|Passive past: was + past participle.',
  'mc|The room ___ every day.|is cleaned;cleans;clean|0|The room does not clean itself → passive.',
  'type|These cars (make) ___ in Germany.|are made|Plural, present passive → are made.',
  'mc|My phone ___ yesterday.|was stolen;stole;is stole|0|Passive past: was stolen.',
  'ord|The letter was sent by the manager.']);
U('relative', 2, '🔗', 'Relative clauses', 'Join ideas with <b>who</b> (people), <b>which / that</b> (things), <b>whose</b> (belonging), <b>where</b> (places). You can leave out <b>that / which</b> when it is the object of the clause.',
  ['The girl who lives next door is a nurse.', 'This is the book that I told you about.', 'He\'s the man whose wife is a singer.', 'That\'s the café where we first met.'], [
  'mc|The girl ___ lives next door is a nurse.|who;which;whose|0|A person → who.',
  'mc|This is the book ___ I told you about.|which;who;whose|0|A thing → which / that.',
  "mc|He's the man ___ wife is a famous singer.|whose;who;whom|0|Belonging → whose.",
  "mc|That's the café ___ we first met.|where;which;who|0|A place → where.",
  'type|The phone ___ I bought last week is broken. (that / which)|that/which|A thing → that / which.',
  'ord|The woman who called you is waiting outside.']);

/* ---- B2 ---- */
U('third', 3, '↩️', 'Third conditional and wishes', '<b>Third conditional</b> (imaginary past): <em>If + past perfect, would have + past participle.</em> <b>wish + past simple</b> = regret about now; <b>wish + past perfect</b> = regret about the past.',
  ['If she had studied, she would have passed.', 'I wish I were taller.', 'I wish I hadn\'t sent that email.'], [
  'mc|If she had studied, she ___ the test.|would have passed;would pass;had passed|0|Third conditional result: would have + past participle.',
  'mc|I wish I ___ taller.|were;am;would be|0|Present regret: wish + past simple.',
  "mc|If they ___ earlier, they wouldn't have missed the train.|had left;left;would leave|0|If + past perfect.",
  "mc|I wish I ___ that email yesterday.|hadn't sent;didn't send;wouldn't send|0|Past regret: wish + past perfect.",
  'type|If I (know) ___ the truth, I would have acted differently.|had known|If + past perfect.',
  'ord|If I had seen him, I would have said hello.']);
U('reported', 3, '💬', 'Reported speech', 'When you report what someone said, <b>shift the tense back</b>: am/is → was, will → would, did → had done. Reported questions use <b>if / whether</b> or a question word with <b>normal word order</b>.',
  ['“I am tired.” → She said she was tired.', '“I will call you.” → He said he would call me.', '“Did you finish?” → She asked if I had finished.'], [
  'mc|She said she ___ tired.|was;is;were|0|Backshift: am/is → was.',
  'mc|He asked me where I ___.|lived;do live;did live|0|Reported question: statement word order, past tense.',
  'mc|"I will call you." → He said he ___ call me.|would;will;wills|0|will → would.',
  'mc|"Did you finish?" → She asked ___ I had finished.|if;that;what|0|Yes / no questions → if / whether.',
  'type|"I am busy." → He said he (be) ___ busy.|was|am → was.',
  'ord|She told me that she had already eaten.']);
U('narrative', 3, '📖', 'Past perfect and narrative tenses', 'Use the <b>past perfect (had + past participle)</b> for an action <b>before</b> another past action. Use the <b>past continuous</b> for background and interrupted actions, and <b>past perfect continuous</b> for how long something had been happening.',
  ['When I arrived, the train had left.', 'While I was cooking, the phone rang.', 'He had been running for an hour when it started to rain.'], [
  'mc|When I arrived, the train ___.|had left;has left;leaved|0|The train left first → past perfect.',
  'mc|She was tired because she ___ all night.|had been working;has worked;was worked|0|Duration before a past moment → past perfect continuous.',
  'mc|While I ___, the phone rang.|was cooking;cooked;had cooked|0|Longer background action → past continuous.',
  'type|By 5 pm, they (finish) ___ the project.|had finished|By + past time → past perfect.',
  'mc|He ___ for an hour when it started to rain.|had been running;has run;was ran|0|Past perfect continuous.',
  'ord|After she had finished her work, she went home.']);
U('deduction', 3, '🕵️', 'Modals of deduction', 'To say how sure you are: <b>must</b> (very sure it is true), <b>might / may / could</b> (possible), <b>can\'t</b> (very sure it is not true). For the past use <b>must / might / can\'t + have + past participle</b>.',
  ['He isn\'t answering. He must be asleep.', 'She must have left her keys at home.', 'He can\'t be in London; I saw him today.'], [
  "mc|He's not answering. He ___ asleep.|must be;must have;should been|0|Very sure about now → must be.",
  "mc|She ___ the keys at home; they aren't in her bag.|must have left;must leave;can leave|0|Past deduction → must have + past participle.",
  'mc|He ___ be in London; I saw him in Colombo today.|can\'t;must;may|0|Very sure it is NOT true → can\'t.',
  "mc|They ___ gotten lost; they're two hours late.|might have;might;may be|0|Possible past explanation → might have.",
  'type|The lights are off. They (must / be) ___ out.|must be|Strong deduction about now.',
  "ord|He can't have finished already."]);
U('gerund', 3, '⚙️', 'Gerund or infinitive?', 'Some verbs take the <b>-ing form</b> (enjoy, avoid, suggest, deny, finish), others take <b>to + verb</b> (decide, want, hope, plan, manage). A few change meaning: <b>remember / forget / stop + to</b> or <b>-ing</b>. After a preposition always use <b>-ing</b>.',
  ['I enjoy listening to music.', 'She decided to study abroad.', 'He suggested taking a taxi.', 'I look forward to meeting you.'], [
  'mc|I enjoy ___ to music.|listening;to listen;listen|0|enjoy + -ing.',
  'mc|She decided ___ abroad.|to study;studying;study|0|decide + to.',
  'mc|I forgot ___ the door, so someone broke in.|to lock;locking;lock|0|Forgot to do something (I never did it).',
  'mc|She suggested ___ a taxi.|taking;to take;take|0|suggest + -ing.',
  'type|They avoided (talk) ___ about the problem.|talking|avoid + -ing.',
  'ord|I look forward to meeting you next week.']);

/* ---- C1 ---- */
U('inversion', 4, '🎩', 'Inversion for emphasis', 'After negative or limiting adverbs at the start of a sentence (<b>never, rarely, seldom, hardly, no sooner, not only, only after, under no circumstances</b>) put the <b>auxiliary before the subject</b>: <em>Never have I seen…</em>',
  ['Never have I seen such a place.', 'Not only was he late, but he also forgot the files.', 'Under no circumstances should you open this door.'], [
  'mc|Never ___ such a beautiful place.|have I seen;I have seen;I saw|0|Never + auxiliary + subject.',
  'mc|Only after the meeting ___ the truth.|did she learn;she learned;learned she|0|Only after … + did + subject + base verb.',
  'mc|Rarely ___ so much pressure.|do we face;we face;we do face|0|Rarely + auxiliary + subject.',
  'type|Not only ___ he rude, but he was also dishonest.|was|Not only + was + subject.',
  'mc|Hardly had we started ___ it began to rain.|when;than;that|0|Hardly … when.',
  'ord|Under no circumstances should you open this door.']);
U('mixed', 4, '🧩', 'Mixed conditionals', 'Mix a <b>past condition</b> with a <b>present result</b> (If I had taken that job, I would be living in London now) or a <b>present condition</b> with a <b>past result</b> (If she weren\'t so shy, she would have got the role).',
  ['If I had taken that job, I would be living in London now.', 'But for your advice, I would have made the wrong decision.'], [
  'mc|If I had taken that job, I ___ in London now.|would be living;would have lived;will live|0|Past condition → present result: would + base verb.',
  "mc|If she weren't so shy, she ___ the lead role last year.|would have got;would get;will get|0|Present condition → past result.",
  'mc|If we had saved more, we ___ a bigger house now.|could afford;can afford;afforded|0|Past condition → present result.',
  'type|If I (be) ___ more organised, I would have met the deadline.|were/was|Present trait → past result.',
  'mc|But for your advice, I ___ the wrong decision.|would have made;would make;will make|0|But for = if it hadn\'t been for.',
  'ord|If I had listened to her, I would be happier now.']);
U('cleft', 4, '🎯', 'Cleft sentences and emphasis', 'Put the important idea in focus: <b>What I need is…</b> · <b>It was Maria who/that…</b> · <b>The thing that annoys me is…</b> · <b>What surprised me most was…</b>',
  ['What I really need is a long holiday.', 'It was Maria who solved the problem.', 'What I want to know is why he left.'], [
  'mc|___ I need is a good night\'s sleep.|What;That;Which|0|What-cleft.',
  'mc|It was Maria ___ solved the problem.|who;what;whose|0|It was + person + who.',
  'mc|What surprised me most ___ his calm reaction.|was;were;being|0|The “what” clause is singular → was.',
  'type|It is honesty ___ matters most.|that|It is + noun + that.',
  'mc|The thing that annoys me ___ the noise.|is;are;being|0|Singular subject → is.',
  'ord|What I want to know is why he left.']);
U('academic', 4, '🎓', 'Hedging and linking (academic style)', 'Academic English avoids absolute claims: <b>suggest, tend to, may, appears to, it could be argued that</b>. Link ideas precisely: <b>nevertheless, whereas, consequently, despite</b> (+ noun / -ing).',
  ['The results suggest that the method is effective.', 'The policy has been criticised; nevertheless, it remains popular.', 'It could be argued that technology has improved education.'], [
  'mc|The results ___ that the method is effective.|suggest;are proving;are certain|0|Hedged verb for academic claims.',
  'mc|___ the benefits, there are several risks.|Despite;Although;However|0|Despite + noun phrase.',
  'mc|The policy has been criticised; ___, it remains popular.|nevertheless;therefore;moreover|0|Contrast → nevertheless.',
  'mc|It is widely believed ___ the economy will recover.|that;what;whose|0|It is believed that…',
  'type|Prices ___ to rise during holidays. (tend)|tend|tend to + verb.',
  'ord|It could be argued that technology has improved education.']);

/* ===== Vocabulary: word|part of speech|meaning|example|Sinhala ===== */
const VOCAB = [];
const V = (l, rows) => rows.trim().split('\n').forEach(r => { const [w, pos, m, ex, si] = r.split('|'); VOCAB.push({ w, pos, m, ex, si, l }); });
V(0, `
family|noun|your parents, children and relatives|My family is very close.|පවුල
breakfast|noun|the first meal of the day|I have breakfast at seven.|උදෑසන ආහාරය
station|noun|a place where trains or buses stop|The station is near my house.|දුම්රිය / බස් ස්ථානය
cheap|adjective|not costing much money|These shoes are cheap.|ලාභ / මිල අඩු
expensive|adjective|costing a lot of money|That car is very expensive.|මිල අධික
borrow|verb|take something and give it back later|Can I borrow your pen?|ආපසු දෙන්නට ඉල්ලාගන්න
carry|verb|hold something and take it somewhere|She carries a heavy bag.|ගෙනයන්න / උසුලන්න
early|adverb|before the usual time|I get up early.|කලින් / අලුයම
usually|adverb|most of the time|I usually walk to school.|සාමාන්‍යයෙන්
weather|noun|sun, rain, wind and temperature|The weather is nice today.|කාලගුණය
neighbour|noun|a person who lives near you|My neighbour is very kind.|අසල්වැසියා
ticket|noun|a paper that lets you travel or enter|I bought two tickets.|ටිකට් පත
kitchen|noun|the room where you cook|Mum is in the kitchen.|මුළුතැන්ගෙය
wear|verb|have clothes on your body|He wears a blue shirt.|ඇඳගන්න / පැළඳගන්න
visit|verb|go to see a person or place|We visit our grandparents on Sundays.|බලන්න යන්න
hungry|adjective|wanting to eat|I'm hungry. Let's eat.|බඩගිනි
dangerous|adjective|could hurt you|The road is dangerous at night.|භයානක
beautiful|adjective|very pleasant to look at|What a beautiful garden!|ලස්සන
`);
V(1, `
accident|noun|something bad that happens by chance|He had an accident on his bike.|අනතුර
advice|noun|an opinion about what someone should do|Can you give me some advice?|උපදෙස්
argue|verb|speak angrily with someone who disagrees|They argue about money.|වාද කරන්න / රණ්ඩු වෙන්න
collect|verb|bring things together|She collects old coins.|එකතු කරන්න
comfortable|adjective|giving a pleasant, relaxed feeling|This sofa is very comfortable.|සුවපහසු
decide|verb|choose after thinking|I decided to learn English.|තීරණය කරන්න
delicious|adjective|tasting very good|The curry was delicious.|රසවත්
discover|verb|find something for the first time|They discovered a new beach.|සොයාගන්න
empty|adjective|with nothing inside|The box is empty.|හිස්
improve|verb|become or make better|I want to improve my English.|දියුණු කරන්න
include|verb|have something as a part|The price includes breakfast.|ඇතුළත් කරන්න
lonely|adjective|sad because you are alone|He felt lonely in the new city.|තනිකම් / හුදකලා
prefer|verb|like one thing more than another|I prefer tea to coffee.|වඩාත් කැමති වෙන්න
repair|verb|fix something broken|He repaired my bike.|අලුත්වැඩියා කරන්න
receive|verb|get something that is sent|I received your message.|ලබාගන්න
successful|adjective|achieving what you wanted|She is a successful doctor.|සාර්ථක
invite|verb|ask someone to come to an event|I invited him to my birthday.|ආරාධනා කරන්න
journey|noun|travelling from one place to another|The journey took five hours.|ගමන
`);
V(2, `
achieve|verb|succeed in doing something|She achieved her goal.|ඉටුකරගන්න / ළඟාවෙන්න
afford|verb|have enough money to buy something|I can't afford a new car.|මිලට ගැනීමට (මුදල්) හැකිවීම
benefit|noun|a good result or advantage|Exercise has many benefits.|ප්‍රතිලාභ / වාසිය
challenge|noun|something difficult that tests you|Learning a language is a challenge.|අභියෝගය
consider|verb|think carefully about something|I'm considering a new job.|සලකා බලන්න
convenient|adjective|easy and suitable for your needs|The shop is convenient for me.|පහසු
depend|verb|be decided by something else|It depends on the weather.|රඳා පවතී
effort|noun|energy used to do something|It takes effort to learn.|උත්සාහය / වෑයම
familiar|adjective|well known to you|Her face looks familiar.|හුරුපුරුදු
generous|adjective|happy to give more than is needed|He is generous with his time.|ත්‍යාගශීලී
opportunity|noun|a chance to do something good|This is a great opportunity.|අවස්ථාව
patient|adjective|able to wait calmly|Be patient with children.|ඉවසිලිවන්ත
previous|adjective|happening before|In my previous job I was a clerk.|පෙර / කලින්
reliable|adjective|can be trusted|He is a reliable friend.|විශ්වාසදායක
responsible|adjective|in charge; to blame|Who is responsible for this?|වගකිව යුතු
suitable|adjective|right for a purpose|This film is suitable for children.|සුදුසු
support|verb|help or encourage|My parents support me.|සහාය දෙන්න
tradition|noun|a custom passed down for many years|Wearing white is a tradition.|සම්ප්‍රදාය
`);
V(3, `
adapt|verb|change to suit new conditions|She adapted quickly to the new school.|හැඩගැසෙන්න / අනුවර්තනය වෙන්න
assume|verb|think something is true without proof|I assumed you knew.|උපකල්පනය කරන්න
boost|verb|increase or improve|Exercise can boost your mood.|වැඩි කරන්න / ඉහළ නංවන්න
contribute|verb|give to a shared goal|Everyone contributed to the project.|දායක වෙන්න
crucial|adjective|extremely important|Sleep is crucial for health.|අත්‍යවශ්‍ය / තීරණාත්මක
demonstrate|verb|show clearly|The study demonstrates a link.|පෙන්වා දෙන්න
efficient|adjective|working well without wasting time or energy|The new system is more efficient.|කාර්යක්ෂම
enhance|verb|improve the quality of something|Music can enhance learning.|වැඩිදියුණු කරන්න
estimate|verb|guess the amount or value|They estimate the cost at five thousand dollars.|ඇස්තමේන්තු කරන්න
evaluate|verb|judge how good something is|We evaluate each student carefully.|ඇගයීමට ලක් කරන්න
flexible|adjective|able to change easily|I have flexible working hours.|නම්‍යශීලී
impact|noun|a strong effect|Social media has a big impact on teenagers.|බලපෑම
maintain|verb|keep something in good condition|It's important to maintain good habits.|පවත්වාගෙන යන්න
obvious|adjective|easy to see or understand|The answer is obvious.|පැහැදිලි
potential|noun|ability to develop in the future|She has great potential.|විභවය / හැකියාව
reluctant|adjective|not willing; hesitant|He was reluctant to speak.|අකමැති / පැකිලෙන
significant|adjective|large or important enough to notice|A significant number of people agreed.|සැලකිය යුතු / වැදගත්
sustainable|adjective|able to continue without causing harm|We need sustainable energy.|තිරසර
`);
V(4, `
ambiguous|adjective|having more than one possible meaning|The instructions were ambiguous.|අපැහැදිලි / ද්වයාර්ථ
comprehensive|adjective|including everything important|She wrote a comprehensive report.|සවිස්තරාත්මක / පුළුල්
constraint|noun|something that limits what you can do|Budget constraints limited the project.|සීමාව / බාධකය
controversial|adjective|causing public disagreement|It was a controversial decision.|මතභේදයට තුඩු දෙන
deteriorate|verb|become worse|His health deteriorated quickly.|පිරිහෙන්න / නරක අතට හැරෙන්න
diminish|verb|become or make smaller|Interest diminished over time.|අඩුවෙන්න
elaborate|verb|give more detail about something|Could you elaborate on that point?|වැඩිදුරටත් විස්තර කරන්න
fluctuate|verb|go up and down often|Prices fluctuate during the year.|උච්චාවචනය වෙන්න
inevitable|adjective|certain to happen; cannot be avoided|Change is inevitable.|වළක්වාගත නොහැකි
mitigate|verb|make something less severe|Trees mitigate the effects of heat.|සමනය කරන්න / අඩු කරන්න
notion|noun|an idea or belief|the notion of fairness|අදහස / සංකල්පය
paradigm|noun|a typical model or pattern|This is a new paradigm in education.|ආකෘතිය
plausible|adjective|seems reasonable and likely to be true|That is a plausible explanation.|විශ්වාස කළ හැකි
resilient|adjective|able to recover quickly after difficulty|Children are often resilient.|ඔරොත්තු දෙන
scrutinise|verb|examine very carefully|Auditors scrutinise the accounts.|සියුම්ව පරීක්ෂා කරන්න
subsequent|adjective|coming after something else|In subsequent years, prices rose.|ඉන්පසු පැමිණෙන
undermine|verb|weaken gradually|Rumours undermined his authority.|දුර්වල කරන්න
viable|adjective|able to work successfully|It is a viable alternative.|ක්‍රියාත්මක කළ හැකි
`);
