const DEFAULT_ARTICLES = [
  {
    id: 0, category: 'Mindfulness & Society', img: 'images/hero_banner.png',
    title: 'The Quiet Revolution: Why Stillness Is the New Strength',
    author: 'Layla Ahmadi', date: 'May 28, 2026', read: '8 min read',
    excerpt: 'In an age of relentless noise, the most radical act may be to simply pause.',
    content: `<p>In an age of relentless noise, the most radical act may be to simply pause. Across cities, universities, and online communities, a quiet revolution is underway — one that prizes stillness, reflection, and intentional living over the frantic pace of modern life.</p>
<p>The movement has no single leader, no manifesto. It emerges in the growing interest in meditation apps downloaded by millions, in university wellness programs that have become the most-subscribed offerings on campus, in the explosion of journals, retreats, and slow-living communities worldwide.</p>
<p>What does it mean to be strong today? For a growing number of people, strength is no longer measured in productivity metrics or social media engagement. It is measured in the capacity to sit with uncertainty, to feel without being overwhelmed, to respond rather than react.</p>
<p>Ancient contemplative traditions — from Buddhist mindfulness to Stoic reflection to Sufi meditation — are finding new audiences not because they offer escape, but because they offer something rarer: tools for being fully present in a world designed to fragment our attention.</p>
<p>The research is catching up. Neuroscience now confirms what meditators have long reported: that regular stillness practice literally reshapes the brain, strengthening the prefrontal cortex and calming the amygdala's stress responses. Silence, it turns out, is a form of intelligence.</p>`
  },
  {
    id: 1, category: 'Philosophy & Spirituality', img: 'images/article_philosophy.png',
    title: 'On the Courage to Think Differently',
    author: 'Dr. Reem Khalil', date: 'May 25, 2026', read: '7 min read',
    excerpt: 'Philosophy demands a quieter, more demanding courage — the courage of intellectual honesty.',
    content: `<p>There is a particular kind of courage that philosophy demands of us — not the courage of the battlefield, but the quieter, more demanding courage of intellectual honesty. The courage to follow an argument wherever it leads, even when it unsettles our most cherished beliefs.</p>
<p>Socrates called it the examined life. Kant called it the use of one's own understanding without direction from another. Whatever we name it, this intellectual courage has always been rare and has always been necessary.</p>
<p>In our current moment — saturated with information, polarized by algorithm, and pressured toward conformity by social media's approval mechanisms — the capacity to think genuinely for oneself has become both more difficult and more urgent than ever.</p>
<p>Philosophy's great gift is not a set of answers, but a set of tools: the ability to distinguish between evidence and opinion, to recognize logical fallacy, to hold complexity without collapsing it into simple certainty.</p>
<p>To think differently is not to be contrarian. It is to be genuinely open — to evidence, to other perspectives, to the possibility that you might be wrong. In a world that rewards confidence, this openness is an act of profound intellectual courage.</p>`
  },
  {
    id: 2, category: 'Psychology & Science', img: 'images/article_psychology.png',
    title: 'The Neuroscience of Hope',
    author: 'Prof. Lena Marek', date: 'May 22, 2026', read: '12 min read',
    excerpt: 'New research reveals how the hopeful brain literally rewires itself.',
    content: `<p>What happens in the brain when we hope? For centuries, hope was the province of theology and poetry. Today, it is increasingly the subject of rigorous neuroscience — and the findings are extraordinary.</p>
<p>Hope is not merely a feeling. It is a cognitive architecture — a way of relating to the future that involves specific neural circuits, particular patterns of thought, and trainable mental habits. The hopeful brain, research reveals, literally functions differently from the despairing brain.</p>
<p>Studies using fMRI have shown that hopeful thinking activates the prefrontal cortex — the seat of planning, problem-solving, and long-term thinking — while simultaneously dampening the amygdala's fear response. In other words, hope makes us smarter and calmer at the same time.</p>
<p>The most exciting finding is that hope is not a fixed trait. It is a skill. Through specific practices — visualization, goal-setting, cultivating agency narratives — individuals can train themselves to become more hopeful.</p>`
  },
  {
    id: 3, category: 'Campus News', img: 'images/article_campus.png',
    title: 'Students Launch Wellness Collective',
    author: 'Omar Fawzi', date: 'May 20, 2026', read: '5 min read',
    excerpt: 'A grassroots movement born in a dorm room grows into a university-wide initiative.',
    content: `<p>What began as an informal study group in a small campus dormitory has grown into one of the most impactful student-led initiatives our university has seen in years: the Campus Wellness Collective.</p>
<p>Founded eighteen months ago by five students from different faculties — psychology, engineering, literature, medicine, and philosophy — the Collective has since grown to over 400 active members, offering weekly meditation sessions, peer support circles, and monthly speaker events.</p>
<p>"We noticed that mental health conversations were happening everywhere except in the one place they mattered most: among students themselves," says co-founder Mariam Al-Sayed.</p>
<p>The Collective has now partnered with the university's psychology department to develop a formal peer-support training program, and has received seed funding from the student union to expand its programming.</p>`
  },
  {
    id: 4, category: 'Mindfulness & Society', img: 'images/article_mindfulness.png',
    title: 'Slow Down: How Urban Communities Are Reclaiming Their Time',
    author: 'Nour Hassan', date: 'May 26, 2026', read: '6 min read',
    excerpt: 'From intentional living movements to digital detox retreats, cities are reimagining meaningful life.',
    content: `<p>The concept of slow living has been brewing in counter-cultural circles for decades, but something different is happening now. What was once the domain of wellness retreats and lifestyle bloggers has entered the mainstream — and it is beginning to reshape cities.</p>
<p>From "15-minute city" urban planning initiatives in Paris and Melbourne to community gardens springing up in dense metropolitan areas, from public meditation spaces in corporate parks to "phone-free" zones spreading through restaurants and cafes — the built environment is slowly catching up with a growing cultural hunger for pace, presence, and place.</p>
<p>The data supports the shift. A 2025 global survey found that 67% of urban residents actively seek out "slow" experiences in their weekly routines — a 22% increase from five years prior.</p>
<p>Community organizers speak of a "reclamation movement" — a deliberate effort to take back time from the attention economy and invest it in what sociologists call "thick relationships": the kind built not in quick exchanges but in shared, unhurried presence.</p>`
  },
  {
    id: 5, category: 'Mindfulness & Society', img: 'images/article_mindfulness.png',
    title: 'The Social Media Paradox: Connected Yet Alone',
    author: 'Sara Al-Jabri', date: 'May 18, 2026', read: '5 min read',
    excerpt: 'We have never been more connected. We have never been more lonely.',
    content: `<p>We have never been more connected. We have never been more lonely. This paradox sits at the heart of the social media age — and researchers are only now beginning to understand why.</p>
<p>The answer, it turns out, is not simply about screen time. It is about the quality of connection that digital platforms afford — and how that quality differs from the face-to-face interaction that human beings evolved to need.</p>
<p>Digital connection is, by its nature, mediated and curated. We present edited versions of ourselves; we receive edited versions of others. The spontaneity, the physical presence, the shared silence that constitute deep human connection are largely absent.</p>
<p>What platforms offer instead is a simulation of connection — the dopamine hit of a like, the warmth of a comment, the sense of being seen. These are real rewards, but they are thin substitutes for genuine intimacy.</p>
<p>The path forward is not to abandon social media but to use it consciously — as a bridge to real-world connection rather than a replacement for it.</p>`
  },
  {
    id: 6, category: 'Mindfulness & Society', img: 'images/article_mindfulness.png',
    title: 'Breathing Together: The Power of Community Meditation',
    author: 'Khalid Mansour', date: 'May 14, 2026', read: '4 min read',
    excerpt: 'What happens when we meditate not alone but together?',
    content: `<p>Meditation has long been understood as a solitary practice — the lone practitioner on the cushion, eyes closed, turning inward. But a growing body of research and a proliferating number of community meditation groups are revealing something surprising: meditating together amplifies the benefits of meditating alone.</p>
<p>The phenomenon is not mystical, though it may feel that way. It is rooted in well-documented principles of social psychology: the way shared attention creates group coherence, the way witnessing others in practice reinforces our own commitment, the way communal silence deepens individual quiet.</p>
<p>Community meditation centers — from traditional Buddhist sanghas to modern secular mindfulness studios — are reporting unprecedented growth. After years of competing with apps and online programs, group practice is having a renaissance.</p>
<p>Perhaps the most powerful element is the simplest: the knowledge that you are not alone in the effort to be present. In a world of relentless individuation, breathing together is a quietly radical act.</p>`
  },
  {
    id: 7, category: 'Mindfulness & Society', img: 'images/article_mindfulness.png',
    title: 'Nature as Medicine: Forest Bathing and Urban Stress',
    author: 'Amira Toumi', date: 'May 10, 2026', read: '7 min read',
    excerpt: 'The Japanese practice of Shinrin-yoku is transforming how we think about urban wellbeing.',
    content: `<p>In Japan, it has a name: Shinrin-yoku, or "forest bathing." The practice — simply spending quiet, attentive time among trees — has been prescribed by Japanese doctors for decades. Now Western medicine is catching up.</p>
<p>A landmark study published in 2024 found that just 120 minutes of time in natural environments per week was associated with significantly better health and wellbeing outcomes — regardless of how those two hours were distributed. Short daily walks in parks, weekend hikes, lunch breaks in urban gardens: all counted.</p>
<p>The mechanisms are becoming clearer. Trees emit phytoncides — airborne chemical compounds that boost the immune system, reduce cortisol levels, and lower blood pressure. The fractal patterns of natural forms — the branching of trees, the flow of water — appear to have a measurably calming effect on the nervous system.</p>
<p>For urban planners and public health officials, the implications are profound. Green space is not an aesthetic luxury. It is a health infrastructure as essential as hospitals and clinics.</p>`
  },
  {
    id: 8, category: 'Philosophy & Spirituality', img: 'images/article_philosophy.png',
    title: 'Stoicism in the Digital Age: Ancient Wisdom for Modern Anxiety',
    author: 'Dr. Reem Khalil', date: 'May 24, 2026', read: '10 min read',
    excerpt: 'Marcus Aurelius could not have imagined notification badges — yet his meditations speak directly to our crisis of attention.',
    content: `<p>Marcus Aurelius could not have imagined notification badges or doomscrolling — yet his meditations speak directly to our contemporary crisis of attention and meaning.</p>
<p>"You have power over your mind, not outside events," he wrote. "Realize this, and you will find strength." In a world where the outside events — the headlines, the trending topics, the social media storms — now arrive in real time, this ancient Stoic insight feels less like philosophy and more like urgent medicine.</p>
<p>The resurgence of Stoicism among young people is one of the most interesting intellectual phenomena of the past decade. Books by Ryan Holiday, podcasts by thousands of enthusiasts, dedicated subreddits with millions of members — all point to a generation hungry for exactly what Stoicism offers: a framework for maintaining inner stability amid outer chaos.</p>
<p>The core Stoic distinction — between what is "up to us" and what is not — maps remarkably well onto the challenges of digital life. Algorithm anxiety, comparison culture, the tyranny of metrics: all of these are, in Stoic terms, "not up to us." What is up to us is our response, our attention, our character.</p>
<p>This is not resignation. It is the opposite. By releasing attachment to what we cannot control, Stoicism frees our energy for what we can: the quality of our thinking, the integrity of our actions, the depth of our relationships.</p>`
  },
  {
    id: 9, category: 'Philosophy & Spirituality', img: 'images/article_philosophy.png',
    title: 'The Sufi Path: Mysticism as a Way of Knowing',
    author: 'Tariq Al-Rashid', date: 'May 19, 2026', read: '8 min read',
    excerpt: 'Beyond the rituals of religion lies a tradition of spiritual inquiry that rivals Western philosophy.',
    content: `<p>Beyond the rituals of religion lies a tradition of spiritual inquiry that rivals the most rigorous philosophical traditions of the West. Sufism — the mystical dimension of Islam — is not merely a set of practices but a complete epistemology: a way of knowing that claims direct, experiential access to reality beyond the reach of reason alone.</p>
<p>For the great Sufi philosophers — Ibn Arabi, Rumi, Al-Ghazali — the limitations of rational knowledge were not a weakness to be overcome but a doorway to be entered. Where reason reached its boundary, direct experience began.</p>
<p>This is not anti-intellectualism. The Sufi tradition produced some of the most sophisticated philosophical minds of the medieval period, thinkers who were simultaneously rigorous logicians and profound mystics. The two modes of knowing were not in conflict but in conversation.</p>
<p>What Sufism offers the modern seeker is a tradition of interiority — a mapped and tested path through the inner landscape that is simultaneously ancient and urgently contemporary.</p>`
  },
  {
    id: 10, category: 'Philosophy & Spirituality', img: 'images/article_philosophy.png',
    title: 'Between Certainty and Doubt: Living the Questions',
    author: 'Yasmine Ouhbi', date: 'May 15, 2026', read: '6 min read',
    excerpt: 'Rilke told us to live the questions. But in an age demanding instant answers, can we?',
    content: `<p>Rilke told us to live the questions. But in an age demanding instant answers, can we afford the luxury of not knowing?</p>
<p>The poet Rainer Maria Rilke, in his Letters to a Young Poet, offered advice that has never felt more countercultural: "Be patient toward all that is unsolved in your heart and try to love the questions themselves." He was speaking to a young man anxious about his creative vocation. He might as well have been speaking to us.</p>
<p>We live in an answer economy. Every search query is answered in milliseconds. Every complex situation is reduced to a tweet-length take. Every difficult feeling is diagnosed and prescribed for. The tolerance for uncertainty — for sitting with a question long enough to genuinely understand it — is eroding.</p>
<p>And yet the most important questions of a human life do not yield to quick answers. Who am I? How shall I live? What do I owe others? These questions require not answers but relationships — sustained, honest, courageous engagement over time.</p>
<p>To live the questions is not weakness. It is the highest form of intellectual honesty. It is the willingness to remain open in a world that rewards closure.</p>`
  },
  {
    id: 11, category: 'Psychology & Science', img: 'images/article_psychology.png',
    title: 'The Neuroscience of Hope: What Brain Science Tells Us About Resilience',
    author: 'Prof. Lena Marek', date: 'May 27, 2026', read: '12 min read',
    excerpt: 'New research reveals how the hopeful brain rewires itself and why cultivating optimism is scientifically sound.',
    content: `<p>New research reveals how the hopeful brain literally rewires itself — and why cultivating optimism is one of the most scientifically sound things you can do for your mental and physical health.</p>
<p>For decades, optimism was seen as a personality trait: some people had it, others didn't. The latest neuroscience tells a different story. Hope — genuine, action-oriented hope — is a cognitive skill that can be trained, developed, and sustained even in the face of genuine adversity.</p>
<p>The key breakthrough came with research on what psychologists call "agency thinking" and "pathways thinking" — the twin engines of hope. Agency thinking is the belief that you can influence outcomes; pathways thinking is the ability to generate multiple routes toward your goals.</p>
<p>Together, they form a mental posture that is fundamentally different from wishful thinking. The hopeful person is not the one who denies difficulty but the one who generates options in the face of it.</p>
<p>Practical implications abound: journaling about best possible futures, practicing "if-then" planning, and deliberately recalling past successes all appear to measurably increase hope scores — and with them, resilience, academic performance, and physical health outcomes.</p>`
  },
  {
    id: 12, category: 'Psychology & Science', img: 'images/article_psychology.png',
    title: 'The Trauma We Inherit: Epigenetics and Ancestral Memory',
    author: 'Dr. Farah Noor', date: 'May 21, 2026', read: '9 min read',
    excerpt: 'Can the experiences of our ancestors literally shape our biology?',
    content: `<p>Can the experiences of our ancestors literally shape our biology? The emerging science of epigenetics suggests the answer may be yes — and the implications are profound for how we understand trauma, identity, and healing.</p>
<p>Epigenetics studies how environmental factors can change the way genes are expressed without altering the underlying DNA sequence. What is becoming increasingly clear is that some of these changes can be passed down across generations.</p>
<p>Landmark studies of Holocaust survivors and their descendants, of communities that experienced famine or severe stress, have found measurable differences in stress hormone levels, immune function, and even brain structure — differences that appear to have been transmitted biologically, not merely culturally.</p>
<p>This does not mean we are prisoners of our ancestral past. Epigenetic changes are, by definition, modifiable. Therapy, mindfulness practice, community support, and even physical exercise have all been shown to alter epigenetic markers associated with stress and trauma.</p>
<p>What this science offers is not a new determinism but a new depth: an understanding of why healing is both personal and collective, why our wellbeing is entangled with histories we did not personally live.</p>`
  },
  {
    id: 13, category: 'Psychology & Science', img: 'images/article_psychology.png',
    title: 'Decision Fatigue: Why Your Brain Runs Out of Choices',
    author: 'Dr. Sami Karimi', date: 'May 17, 2026', read: '5 min read',
    excerpt: 'The quality of your decisions deteriorates over the course of the day. Here is what to do about it.',
    content: `<p>By late afternoon, your brain is tired in a very specific way. Not physically exhausted — you may have been sitting at a desk all day. Mentally depleted in the domain of choice. This is decision fatigue: the progressive deterioration in decision quality that occurs after a long session of making choices.</p>
<p>The phenomenon was dramatically demonstrated in a famous study of Israeli judges. Prisoners who appeared before the parole board early in the morning received favorable rulings about 65% of the time. Those who appeared late in the day received favorable rulings less than 20% of the time. The judges were not deliberately biased. They were simply depleted.</p>
<p>Every decision we make — from what to eat for breakfast to which email to answer first — draws from a finite pool of mental resources. As that pool depletes, the brain takes shortcuts: defaulting to the status quo, avoiding complex trade-offs, or simply choosing randomly.</p>
<p>The practical implications are significant: schedule your most important decisions for the morning, reduce trivial choices through routines and defaults, and take genuine breaks that allow cognitive recovery.</p>`
  },
  {
    id: 14, category: 'Psychology & Science', img: 'images/article_psychology.png',
    title: 'Flow States: The Science of Being Fully Alive',
    author: 'Dr. Yara Salim', date: 'May 12, 2026', read: '7 min read',
    excerpt: 'Mihaly Csikszentmihalyi spent decades studying optimal human experience. What he found changes everything.',
    content: `<p>Mihaly Csikszentmihalyi spent decades asking a deceptively simple question: when do people feel most alive? His answer — developed through thousands of interviews with artists, athletes, surgeons, chess players, and factory workers — was both surprising and actionable.</p>
<p>People feel most alive not during rest or leisure, but during flow: the state of complete absorption in a challenging, meaningful activity. Time disappears. Self-consciousness dissolves. The sense of effort is paradoxically accompanied by a sense of ease.</p>
<p>Flow occurs at a specific intersection: when the challenge level of an activity is well-matched to our skill level. Too easy, and we become bored. Too hard, and we become anxious. In the sweet spot between boredom and anxiety, flow emerges.</p>
<p>The neuroscience is catching up. Flow states are associated with the transient hypofrontality hypothesis — a temporary reduction in prefrontal cortex activity that silences the inner critic and enables fluid, intuitive performance.</p>
<p>We can engineer more flow into our lives by structuring activities with clear goals, immediate feedback, and an appropriate challenge-to-skill ratio. This is not merely a productivity strategy. It is a recipe for a life that feels worth living.</p>`
  },
  {
    id: 15, category: 'Reflective Insights', img: 'images/article_reflective.png',
    title: 'On Solitude and Self-Discovery: A Personal Essay',
    author: 'Maya Elias', date: 'May 23, 2026', read: '9 min read',
    excerpt: 'What happens when we stop running from ourselves?',
    content: `<p>What happens when we stop running from ourselves? I found out — not by choice, but by circumstance — during three weeks in a small village in the mountains of northern Lebanon, with no reliable internet, one neighbor, and more silence than I had ever known.</p>
<p>I had brought books. I had brought notebooks. I had brought all the rational equipment of a person who believes they are comfortable with solitude. What I had not brought was any real experience of it.</p>
<p>The first week was uncomfortable in ways I hadn't anticipated. Without the constant stream of information and social signal that constitutes modern life, I became aware of a restlessness I had never noticed because I had never stopped long enough to feel it.</p>
<p>By the second week, something shifted. The restlessness didn't disappear, but I stopped fighting it. I began to notice it with a kind of curious distance, the way you might watch weather move across a landscape. And in that noticing, something quieter began to emerge — a sense of myself that had been obscured, not by trauma or difficulty, but simply by noise.</p>
<p>Dag Hammarskjöld wrote that the longest journey is the journey inward. He was right. And he was also right that the journey is worth making.</p>`
  },
  {
    id: 16, category: 'Reflective Insights', img: 'images/article_reflective.png',
    title: 'Gratitude as a Daily Practice: More Than a Trend',
    author: 'Hana Yusuf', date: 'May 20, 2026', read: '4 min read',
    excerpt: 'Gratitude journals are everywhere. But is there real science behind the practice?',
    content: `<p>Gratitude journals are everywhere. Wellness influencers swear by them. Therapists prescribe them. Corporate wellness programs promote them. Is there real science behind the trend — or is this just another self-help fad?</p>
<p>The answer, reassuringly, is that gratitude practice is genuinely supported by robust research. Multiple randomized controlled trials have found that people who regularly practice gratitude — writing three things they are grateful for, or writing a letter of thanks — report significantly higher levels of wellbeing, lower rates of depression, better sleep, and stronger relationships.</p>
<p>The mechanisms are interesting. Gratitude practice appears to work by shifting attentional bias: training the brain to notice positive experiences that it would otherwise overlook. It also strengthens social bonds by increasing the tendency to acknowledge and appreciate others.</p>
<p>The key, research suggests, is specificity and novelty. Vague gratitude ("I'm thankful for my family") has less impact than specific, detailed appreciation ("I'm grateful that my sister called to check in on me when I was stressed last Tuesday"). And rotating what you notice matters — the practice loses power if it becomes rote.</p>`
  },
  {
    id: 17, category: 'Reflective Insights', img: 'images/article_reflective.png',
    title: 'The Art of Doing Nothing: Sabbath for the Modern Soul',
    author: 'Ibrahim Al-Amin', date: 'May 16, 2026', read: '5 min read',
    excerpt: 'What would it mean to truly stop — not to recharge for more productivity, but simply to be?',
    content: `<p>What would it mean to truly stop — not to recharge for more productivity, but simply to be? The ancient concept of Sabbath — one day in seven given wholly to rest, worship, and relationship — is finding new relevance in an age of always-on culture.</p>
<p>The theologian Walter Brueggemann describes Sabbath as "the refusal to be defined by productivity." In a culture that has essentially made productivity a moral virtue — where "busy" is a status symbol and rest carries a faint whiff of failure — this refusal is genuinely countercultural.</p>
<p>What research on rest consistently shows is that genuine recuperation requires genuine disengagement. Not passive entertainment, not scrolling, not "switching off" while staying connected — but real removal from the demands and metrics of productive life.</p>
<p>The secular version of Sabbath might look different for everyone: a hiking day without devices, a Sunday morning of cooking and conversation, a regular evening of music or reading. The content matters less than the commitment: one pocket of time, regularly protected from the tyranny of the urgent.</p>`
  },
  {
    id: 18, category: 'Reflective Insights', img: 'images/article_reflective.png',
    title: 'Letters to the Future Self: A Writing Exercise',
    author: 'Dina Qassim', date: 'May 11, 2026', read: '3 min read',
    excerpt: 'A simple practice that psychologists say can transform your relationship with time and identity.',
    content: `<p>A simple practice that psychologists say can transform your relationship with time and identity: write a letter to the person you will be in ten years.</p>
<p>The exercise sounds simple, even trivial. In practice, it is often surprisingly difficult — and surprisingly revealing. The future self is close enough to feel real but distant enough to feel like a stranger. We find ourselves wondering: what will matter then that barely registers now? What am I carrying that I hope to have set down?</p>
<p>Research by psychologist Hal Hershfield has found that when people feel a strong sense of connection to their future self — when the future self feels like "me" rather than a stranger — they make significantly better long-term decisions: saving more, exercising more, acting more ethically.</p>
<p>The letter-writing exercise is one of the most effective ways to forge this connection. It invites a particular quality of self-reflection: not anxious rumination about the future, but warm, compassionate dialogue with the person you are becoming.</p>
<p>Try it. Write honestly. You may be surprised by what the practice reveals — about your values, your fears, and the life you are quietly, without quite realizing it, in the process of choosing.</p>`
  },
  {
    id: 19, category: 'Campus News', img: 'images/article_campus.png',
    title: 'Student-Led Wellness Initiative Transforms Campus Culture',
    author: 'Omar Fawzi', date: 'May 29, 2026', read: '7 min read',
    excerpt: 'A grassroots movement born in a dorm room has grown into a university-wide program.',
    content: `<p>A grassroots movement born in a small dorm room has grown into a university-wide mental health program, changing how students relate to stress, identity, and community.</p>
<p>Eighteen months ago, five students with nothing in common but a shared sense that something was missing started meeting weekly in a common room. They called it a "wellness circle" — a deliberately vague term that allowed for many kinds of conversation: academic pressure, family expectations, identity, loneliness, meaning.</p>
<p>Today, the Campus Wellness Collective they founded runs twenty-three weekly programs, has trained forty peer supporters, and has influenced changes in university mental health policy. Their model is now being adapted by three other universities.</p>
<p>"The most important thing we did was make it normal to talk about this stuff," says co-founder Fatima Al-Amin. "Not in a clinical way, not in a crisis-response way — just in a human way."</p>
<p>The Collective's annual report, published last month, found that students who participated in at least one program per week reported 34% lower rates of academic burnout and 41% higher scores on measures of sense of belonging.</p>`
  },
  {
    id: 20, category: 'Campus News', img: 'images/article_campus.png',
    title: 'Philosophy Club Hosts Annual Socratic Debate Night',
    author: 'Layla Ahmadi', date: 'May 27, 2026', read: '3 min read',
    excerpt: 'Over 200 students gathered for a night of rigorous, respectful philosophical dialogue.',
    content: `<p>Over 200 students gathered last Thursday evening for what has become one of the most anticipated events in the campus calendar: the Philosophy Club's Annual Socratic Debate Night.</p>
<p>Unlike conventional debates — where teams are assigned positions to defend — Socratic debate invites all participants into open inquiry. The goal is not to win but to think: to follow the argument wherever it leads, to change one's mind publicly and without embarrassment, to discover together what is true rather than proving what one already believes.</p>
<p>This year's central question: "Is it possible to be a good person without being a good citizen?" The discussion ranged from Aristotle to Hannah Arendt, from the Arab Spring to the ethics of civil disobedience, from personal integrity to collective responsibility.</p>
<p>"What strikes me every year," said club president Karim Nassar, "is how much students want this. They want to think seriously about hard questions. They're hungry for it."</p>`
  },
  {
    id: 21, category: 'Campus News', img: 'images/article_campus.png',
    title: 'New Psychology Research Lab Opens at North Campus',
    author: 'Sara Al-Jabri', date: 'May 25, 2026', read: '4 min read',
    excerpt: 'The state-of-the-art facility will focus on adolescent wellbeing and resilience research.',
    content: `<p>The university officially opened its new Psychology and Wellbeing Research Laboratory at the North Campus last week, in a ceremony attended by faculty, students, and representatives from the Ministry of Education.</p>
<p>The state-of-the-art facility, funded by a combination of government grants and private philanthropy, will house researchers working on three priority areas: adolescent mental health, the psychology of academic resilience, and the application of mindfulness-based interventions in educational settings.</p>
<p>"This lab represents a commitment to understanding human flourishing not just in clinical settings but in the places where most people actually live their lives: schools, universities, communities," said lab director Prof. Aisha Darwish at the opening ceremony.</p>
<p>The lab will also serve as a training ground for graduate students in clinical and research psychology, and will make its findings available to the university community through an annual public lecture series.</p>`
  },
  {
    id: 22, category: 'Campus News', img: 'images/article_campus.png',
    title: 'Annual Mindfulness Week: Schedule and Events',
    author: 'Nour Hassan', date: 'May 23, 2026', read: '2 min read',
    excerpt: 'A full week of workshops, lectures, and practices open to the entire campus community.',
    content: `<p>The university's fourth Annual Mindfulness Week begins on June 9th, with a full program of workshops, lectures, guided practices, and community events open to all students, faculty, and staff.</p>
<p>Highlights this year include a keynote lecture by internationally recognized mindfulness researcher Dr. Jon-Paul Renaud; a day-long silent retreat at the campus meditation garden; and a series of practical workshops on applying mindfulness to academic performance, interpersonal communication, and creative work.</p>
<p>New this year: a dedicated track for faculty members, addressing the particular stressors of academic life and exploring how contemplative practices can enhance both teaching and research.</p>
<p>All events are free and open to the campus community. Registration is recommended for workshops with limited capacity. Full schedule available at the Student Wellness Centre and online through the university portal.</p>`
  },
  {
    id: 23, category: 'Campus News', img: 'images/article_campus.png',
    title: 'Student Journal "Inward" Launches Third Issue',
    author: 'Omar Fawzi', date: 'May 21, 2026', read: '2 min read',
    excerpt: 'The student-edited journal of reflective writing releases its most ambitious issue yet.',
    content: `<p>The student-edited journal of reflective writing, Inward, has released its third issue — its most ambitious yet, featuring contributions from twenty-three student writers across fourteen academic disciplines.</p>
<p>Founded two years ago by a small group of writing students who felt that the university's academic culture left little room for personal, reflective expression, Inward has grown steadily into one of the most-read student publications on campus.</p>
<p>This issue's theme — "Threshold" — invited writers to explore moments of crossing: from ignorance to understanding, from one identity to another, from certainty into doubt. The results are, by turns, lyrical, analytical, vulnerable, and surprising.</p>
<p>"We wanted to create a space where rigorous thinking and genuine feeling could coexist," says editor-in-chief Rania Khalid. "Where a student in engineering could write about grief, and a student in literature could write about the beauty of an equation."</p>
<p>Inward Issue 3 is available in print at the campus library and online at the student publications portal.</p>`
  }
];
