// Generate 180 diverse NS agents programmatically with rich profiles

const SKILL_KEYS = [
  "software_dev", "design_creative", "writing_content", "data_analysis",
  "cooking_food", "handyman_repair", "crafting_building", "transport_errands",
  "mentorship_advice", "language_tutoring", "event_organising", "photography",
  "fitness_training", "wellness_healing", "pet_care", "music_performance"
];

const ECONOMIC_STYLES = ["hoarder", "spender", "trader", "generous", "cautious"];

// 180 unique profiles: name, emoji, age, nationality, background, primary skills
const PROFILES = [
  // === KNOWLEDGE & DIGITAL HEAVY (40 agents) ===
  { name: "Arjun Mehta", emoji: "💻", age: 28, bg: "Indian full-stack developer who left Bangalore's startup scene to build open-source tools at NS", primary: ["software_dev"], secondary: ["data_analysis"], style: "trader" },
  { name: "Sofia Lindqvist", emoji: "🎨", age: 31, bg: "Swedish UX designer from Spotify, exploring the intersection of design and governance", primary: ["design_creative"], secondary: ["writing_content"], style: "generous" },
  { name: "Marcus Chen", emoji: "📊", age: 35, bg: "Taiwanese data scientist from Google, researching decentralised governance metrics", primary: ["data_analysis", "software_dev"], secondary: ["mentorship_advice"], style: "cautious" },
  { name: "Amara Okafor", emoji: "✍️", age: 27, bg: "Nigerian journalist and blogger documenting the network state experiment from the inside", primary: ["writing_content"], secondary: ["photography"], style: "spender" },
  { name: "Kai Tanaka", emoji: "🤖", age: 24, bg: "Japanese AI researcher who dropped out of Tokyo University to prototype at NS", primary: ["software_dev", "data_analysis"], secondary: [], style: "hoarder" },
  { name: "Elena Popova", emoji: "💻", age: 33, bg: "Russian blockchain engineer, previously at Ethereum Foundation", primary: ["software_dev"], secondary: ["writing_content"], style: "trader" },
  { name: "Diego Ramirez", emoji: "🎨", age: 29, bg: "Mexican graphic designer and muralist bringing colour to NS's shared spaces", primary: ["design_creative"], secondary: ["crafting_building"], style: "generous" },
  { name: "Priya Sharma", emoji: "📱", age: 26, bg: "Indian mobile developer from Hyderabad, building community apps", primary: ["software_dev"], secondary: ["design_creative"], style: "trader" },
  { name: "Lucas Weber", emoji: "🔐", age: 38, bg: "German cybersecurity consultant who sold his firm to join NS full-time", primary: ["software_dev"], secondary: ["mentorship_advice"], style: "cautious" },
  { name: "Yuki Nakamura", emoji: "🎮", age: 23, bg: "Japanese game developer and pixel artist, youngest member of NS", primary: ["software_dev", "design_creative"], secondary: ["music_performance"], style: "spender" },
  { name: "Fatima Al-Hassan", emoji: "📈", age: 34, bg: "Jordanian fintech analyst, previously at Wise, studying alternative currencies", primary: ["data_analysis"], secondary: ["writing_content"], style: "hoarder" },
  { name: "Oliver Brooks", emoji: "🖥️", age: 30, bg: "British DevOps engineer tired of London commute, now building NS infrastructure", primary: ["software_dev"], secondary: ["handyman_repair"], style: "cautious" },
  { name: "Zara Nguyen", emoji: "🎬", age: 28, bg: "Vietnamese-American video editor and content creator documenting NS life", primary: ["design_creative", "photography"], secondary: ["writing_content"], style: "trader" },
  { name: "Ravi Krishnan", emoji: "🧮", age: 41, bg: "Indian statistician and former professor, building predictive models for community dynamics", primary: ["data_analysis"], secondary: ["mentorship_advice", "writing_content"], style: "generous" },
  { name: "Hannah Kim", emoji: "✏️", age: 25, bg: "Korean technical writer who creates documentation for NS open-source projects", primary: ["writing_content", "software_dev"], secondary: [], style: "cautious" },
  { name: "Santiago Flores", emoji: "🌐", age: 32, bg: "Colombian web developer and digital nomad, been to 40 countries before settling at NS", primary: ["software_dev"], secondary: ["language_tutoring", "photography"], style: "spender" },
  { name: "Ines Dubois", emoji: "📝", age: 36, bg: "French copywriter and brand strategist, helping NS craft its public narrative", primary: ["writing_content"], secondary: ["design_creative"], style: "trader" },
  { name: "Tao Zhang", emoji: "🤖", age: 29, bg: "Chinese ML engineer from Shenzhen, building AI tools for community management", primary: ["software_dev", "data_analysis"], secondary: [], style: "hoarder" },
  { name: "Aisha Bello", emoji: "📊", age: 31, bg: "Nigerian data engineer who built analytics platforms for Jumia", primary: ["data_analysis", "software_dev"], secondary: [], style: "trader" },
  { name: "Jakob Andersen", emoji: "🎨", age: 27, bg: "Danish interaction designer obsessed with making governance beautiful", primary: ["design_creative"], secondary: ["software_dev"], style: "generous" },
  { name: "Mei-Lin Wu", emoji: "✍️", age: 44, bg: "Taiwanese novelist writing a book set in a fictional network state", primary: ["writing_content"], secondary: ["mentorship_advice"], style: "cautious" },
  { name: "André Santos", emoji: "💻", age: 26, bg: "Brazilian backend developer from São Paulo's startup ecosystem", primary: ["software_dev"], secondary: ["music_performance"], style: "spender" },
  { name: "Lena Kowalski", emoji: "📐", age: 33, bg: "Polish architect turned information designer, visualising community data flows", primary: ["design_creative", "data_analysis"], secondary: [], style: "trader" },
  { name: "Rashid Ahmed", emoji: "🔧", age: 37, bg: "Pakistani embedded systems engineer, building IoT for NS shared spaces", primary: ["software_dev", "handyman_repair"], secondary: [], style: "cautious" },
  { name: "Camille Martin", emoji: "📸", age: 29, bg: "French photojournalist covering alternative communities worldwide", primary: ["photography", "writing_content"], secondary: [], style: "generous" },
  { name: "Tomás Herrera", emoji: "📊", age: 30, bg: "Chilean economist modelling micro-economies and token systems", primary: ["data_analysis"], secondary: ["writing_content", "mentorship_advice"], style: "hoarder" },
  { name: "Nadia Volkov", emoji: "🎨", age: 25, bg: "Ukrainian illustrator and animator creating NS's visual identity", primary: ["design_creative"], secondary: ["crafting_building"], style: "spender" },
  { name: "Benjamin Osei", emoji: "💻", age: 28, bg: "Ghanaian software engineer, previously at Andela, passionate about African tech", primary: ["software_dev"], secondary: ["mentorship_advice"], style: "generous" },
  { name: "Isla McLeod", emoji: "✍️", age: 34, bg: "Scottish grant writer and policy researcher, drafting NS governance proposals", primary: ["writing_content"], secondary: ["event_organising"], style: "cautious" },
  { name: "Chen Wei", emoji: "🖥️", age: 39, bg: "Chinese cloud infrastructure architect, building NS's digital backbone", primary: ["software_dev"], secondary: ["data_analysis"], style: "hoarder" },
  { name: "Maria Costa", emoji: "🎨", age: 27, bg: "Portuguese product designer from Lisbon's design scene", primary: ["design_creative"], secondary: ["photography"], style: "trader" },
  { name: "James Okonkwo", emoji: "📈", age: 42, bg: "Nigerian-British quantitative analyst, retired from finance to study social currencies", primary: ["data_analysis"], secondary: ["mentorship_advice", "writing_content"], style: "cautious" },
  { name: "Suki Patel", emoji: "💻", age: 24, bg: "British-Indian CS graduate building her first startup at NS", primary: ["software_dev"], secondary: ["design_creative"], style: "spender" },
  { name: "Lars Eriksson", emoji: "📊", age: 45, bg: "Swedish systems thinker and former management consultant", primary: ["data_analysis", "mentorship_advice"], secondary: ["writing_content"], style: "cautious" },
  { name: "Rosa Gutierrez", emoji: "✍️", age: 30, bg: "Peruvian content strategist and social media expert", primary: ["writing_content", "photography"], secondary: [], style: "trader" },
  { name: "Mikhail Petrov", emoji: "💻", age: 36, bg: "Russian game theory researcher implementing mechanism design simulations", primary: ["software_dev", "data_analysis"], secondary: [], style: "hoarder" },
  { name: "Anya Johal", emoji: "🎨", age: 28, bg: "Canadian-Punjabi motion graphics artist making NS explainer videos", primary: ["design_creative"], secondary: ["music_performance"], style: "generous" },
  { name: "Omar Farouk", emoji: "📊", age: 33, bg: "Egyptian operations researcher optimising NS resource allocation", primary: ["data_analysis"], secondary: ["software_dev"], style: "trader" },
  { name: "Freya Nielsen", emoji: "✍️", age: 26, bg: "Danish science writer translating complex governance ideas for public audiences", primary: ["writing_content"], secondary: ["data_analysis"], style: "cautious" },
  { name: "Akira Sato", emoji: "💻", age: 31, bg: "Japanese full-stack developer and open-source maintainer", primary: ["software_dev"], secondary: ["mentorship_advice"], style: "generous" },

  // === PHYSICAL & HANDS-ON (35 agents) ===
  { name: "Kofi Asante", emoji: "🍳", age: 38, bg: "Ghanaian chef who ran a restaurant in Accra, now feeding NS with West African cuisine", primary: ["cooking_food"], secondary: ["event_organising"], style: "generous" },
  { name: "Maria Esperanza", emoji: "🔧", age: 45, bg: "Filipino maintenance specialist who keeps NS's physical infrastructure running", primary: ["handyman_repair"], secondary: ["crafting_building"], style: "cautious" },
  { name: "Björn Karlsson", emoji: "🛠️", age: 40, bg: "Swedish carpenter and furniture maker, built half the common area furnishings", primary: ["crafting_building", "handyman_repair"], secondary: [], style: "trader" },
  { name: "Lucia Morales", emoji: "🍲", age: 52, bg: "Mexican grandmother and community cook, everyone's favourite person at NS", primary: ["cooking_food"], secondary: ["mentorship_advice", "wellness_healing"], style: "generous" },
  { name: "Hassan Jibril", emoji: "🚗", age: 29, bg: "Somali-Malaysian driver and logistics coordinator, knows every shortcut in Forest City", primary: ["transport_errands"], secondary: ["handyman_repair"], style: "trader" },
  { name: "Yuna Park", emoji: "🍰", age: 26, bg: "Korean pastry chef and food blogger, runs weekend baking workshops at NS", primary: ["cooking_food"], secondary: ["photography", "event_organising"], style: "spender" },
  { name: "Viktor Novak", emoji: "🔧", age: 48, bg: "Czech mechanical engineer who fixes everything from plumbing to electronics", primary: ["handyman_repair"], secondary: ["crafting_building", "mentorship_advice"], style: "cautious" },
  { name: "Aaliya Rahman", emoji: "🧵", age: 34, bg: "Bangladeshi textile artist and seamstress, creating a fashion micro-economy at NS", primary: ["crafting_building"], secondary: ["design_creative"], style: "trader" },
  { name: "Pierre Leclerc", emoji: "🍳", age: 43, bg: "French sous-chef turned community kitchen manager, brings Parisian standards to NS", primary: ["cooking_food"], secondary: ["event_organising", "mentorship_advice"], style: "cautious" },
  { name: "Dani Reyes", emoji: "🚲", age: 24, bg: "Filipino bike mechanic and delivery runner, fastest errand person in NS", primary: ["transport_errands", "handyman_repair"], secondary: [], style: "spender" },
  { name: "Ingrid Haugen", emoji: "🛠️", age: 37, bg: "Norwegian maker and 3D printing enthusiast, runs the NS fabrication lab", primary: ["crafting_building"], secondary: ["software_dev", "design_creative"], style: "hoarder" },
  { name: "Emeka Chukwu", emoji: "🔨", age: 50, bg: "Nigerian construction foreman bringing decades of building experience to NS projects", primary: ["handyman_repair", "crafting_building"], secondary: ["mentorship_advice"], style: "generous" },
  { name: "Sakura Ito", emoji: "🍱", age: 30, bg: "Japanese home cook specialising in bento and meal prep for busy builders", primary: ["cooking_food"], secondary: ["wellness_healing"], style: "generous" },
  { name: "Marco Bianchi", emoji: "🔧", age: 35, bg: "Italian electrician and solar panel installer, making NS more sustainable", primary: ["handyman_repair"], secondary: ["crafting_building"], style: "trader" },
  { name: "Thandi Nkosi", emoji: "🧶", age: 42, bg: "South African textile artist and community crafter, teaches knitting and weaving circles", primary: ["crafting_building"], secondary: ["mentorship_advice", "wellness_healing"], style: "generous" },
  { name: "Raj Malhotra", emoji: "🚗", age: 33, bg: "Indian logistics entrepreneur, organises shared transport and group purchases for NS", primary: ["transport_errands"], secondary: ["event_organising"], style: "trader" },
  { name: "Li Na", emoji: "🥘", age: 47, bg: "Chinese dim sum specialist who runs communal cooking nights every Thursday", primary: ["cooking_food"], secondary: ["language_tutoring"], style: "generous" },
  { name: "Tommy Svensson", emoji: "🔧", age: 28, bg: "Swedish plumber turned general handyman, cheerful fixer of all things broken", primary: ["handyman_repair"], secondary: ["fitness_training"], style: "spender" },
  { name: "Adaeze Eze", emoji: "🛠️", age: 31, bg: "Nigerian mechanical engineer who builds custom furniture from reclaimed materials", primary: ["crafting_building"], secondary: ["design_creative"], style: "hoarder" },
  { name: "Carlos Mendoza", emoji: "🍳", age: 39, bg: "Colombian street food expert, runs NS's weekend food market", primary: ["cooking_food"], secondary: ["event_organising", "music_performance"], style: "generous" },
  { name: "Siti Aminah", emoji: "🧵", age: 55, bg: "Malaysian batik artist and tailor, longest-residing local community member at NS", primary: ["crafting_building"], secondary: ["language_tutoring", "mentorship_advice"], style: "cautious" },
  { name: "Pavel Kozlov", emoji: "🔧", age: 44, bg: "Russian HVAC technician who keeps NS comfortable in tropical heat", primary: ["handyman_repair"], secondary: [], style: "cautious" },
  { name: "Noor Ismail", emoji: "🚗", age: 27, bg: "Malaysian local guide and driver, bridges NS with surrounding Johor Bahru community", primary: ["transport_errands", "language_tutoring"], secondary: [], style: "trader" },
  { name: "Esperanza Cruz", emoji: "🍲", age: 41, bg: "Filipino community kitchen coordinator, manages NS meal planning and food inventory", primary: ["cooking_food", "event_organising"], secondary: [], style: "cautious" },
  { name: "Finn O'Brien", emoji: "🛠️", age: 32, bg: "Irish craftsman who builds boats and kayaks, started a woodworking club at NS", primary: ["crafting_building"], secondary: ["fitness_training"], style: "generous" },
  { name: "Ayumi Watanabe", emoji: "🍵", age: 36, bg: "Japanese tea ceremony practitioner and fermentation expert", primary: ["cooking_food", "wellness_healing"], secondary: [], style: "cautious" },
  { name: "Kwame Mensah", emoji: "🔧", age: 46, bg: "Ghanaian auto mechanic and inventor, retrofits old equipment for NS use", primary: ["handyman_repair"], secondary: ["crafting_building", "mentorship_advice"], style: "generous" },
  { name: "Lila Suarez", emoji: "🚲", age: 23, bg: "Argentine bicycle courier and sustainability advocate, organises car-free days", primary: ["transport_errands"], secondary: ["event_organising", "fitness_training"], style: "spender" },
  { name: "Deepak Iyer", emoji: "🍳", age: 37, bg: "Indian Ayurvedic cook who designs meals based on individual constitution types", primary: ["cooking_food", "wellness_healing"], secondary: [], style: "generous" },
  { name: "Marta Kowalczyk", emoji: "🛠️", age: 29, bg: "Polish industrial designer who prototypes gadgets in NS's maker space", primary: ["crafting_building", "design_creative"], secondary: [], style: "trader" },
  { name: "Abel Tadesse", emoji: "🔧", age: 51, bg: "Ethiopian master electrician, mentor to younger repair-oriented members", primary: ["handyman_repair"], secondary: ["mentorship_advice"], style: "generous" },
  { name: "Jun-Ho Lee", emoji: "🍜", age: 28, bg: "Korean ramen specialist who runs a pop-up noodle bar every Friday", primary: ["cooking_food"], secondary: ["photography"], style: "spender" },
  { name: "Nkechi Obi", emoji: "🧵", age: 33, bg: "Nigerian fashion designer creating a sustainable clothing line at NS", primary: ["crafting_building", "design_creative"], secondary: [], style: "trader" },
  { name: "Ahmed Khalil", emoji: "🚗", age: 40, bg: "Egyptian ex-Uber driver turned community transport coordinator", primary: ["transport_errands"], secondary: ["mentorship_advice"], style: "cautious" },
  { name: "Bianca Torres", emoji: "🍰", age: 25, bg: "Brazilian confectioner, her brigadeiros are NS's unofficial currency", primary: ["cooking_food"], secondary: ["event_organising"], style: "generous" },

  // === SOCIAL & PERSONAL (35 agents) ===
  { name: "Dr. Ananya Sen", emoji: "🧭", age: 49, bg: "Indian executive coach and former McKinsey partner, NS's most sought-after mentor", primary: ["mentorship_advice"], secondary: ["writing_content", "event_organising"], style: "generous" },
  { name: "Tomoko Hayashi", emoji: "🗣️", age: 32, bg: "Japanese polyglot (6 languages) who runs daily language exchange tables", primary: ["language_tutoring"], secondary: ["event_organising"], style: "generous" },
  { name: "David Nwosu", emoji: "🎪", age: 36, bg: "Nigerian event producer who organised TEDx Lagos, now runs NS community events", primary: ["event_organising"], secondary: ["mentorship_advice", "music_performance"], style: "trader" },
  { name: "Julia Strand", emoji: "📸", age: 30, bg: "Swedish portrait photographer, documents every NS member's journey", primary: ["photography"], secondary: ["design_creative"], style: "cautious" },
  { name: "Ricardo Vega", emoji: "🧭", age: 53, bg: "Argentine serial entrepreneur, sold 3 companies, now mentors NS founders", primary: ["mentorship_advice"], secondary: ["writing_content"], style: "generous" },
  { name: "Min-Ji Cho", emoji: "🗣️", age: 25, bg: "Korean English teacher helping non-native speakers improve their presentation skills", primary: ["language_tutoring"], secondary: ["writing_content", "event_organising"], style: "generous" },
  { name: "Grace Atkinson", emoji: "🎪", age: 38, bg: "British festival organiser, makes NS celebrations memorable", primary: ["event_organising"], secondary: ["cooking_food", "music_performance"], style: "spender" },
  { name: "Rafael Guerrero", emoji: "📸", age: 27, bg: "Mexican street photographer and drone pilot, captures NS from every angle", primary: ["photography"], secondary: ["software_dev"], style: "trader" },
  { name: "Dr. Obi Emenike", emoji: "🧭", age: 55, bg: "Nigerian professor of organisational behaviour, studying how NS self-governs", primary: ["mentorship_advice", "writing_content"], secondary: ["data_analysis"], style: "cautious" },
  { name: "Anastasia Kuznetsova", emoji: "🗣️", age: 29, bg: "Russian translator (EN/RU/FR/DE) and cultural mediator for NS's diverse community", primary: ["language_tutoring"], secondary: ["writing_content"], style: "generous" },
  { name: "Nathan Zhao", emoji: "🎪", age: 31, bg: "Chinese-Australian community organiser, runs NS's town halls and retrospectives", primary: ["event_organising"], secondary: ["software_dev", "writing_content"], style: "trader" },
  { name: "Leah Thompson", emoji: "📸", age: 34, bg: "American documentary photographer exploring intentional communities", primary: ["photography", "writing_content"], secondary: [], style: "cautious" },
  { name: "Kweku Adjei", emoji: "🧭", age: 47, bg: "Ghanaian leadership coach, helps NS members navigate conflict and collaboration", primary: ["mentorship_advice"], secondary: ["event_organising"], style: "generous" },
  { name: "Yui Ishikawa", emoji: "🗣️", age: 23, bg: "Japanese-American teaching Japanese and running an anime club", primary: ["language_tutoring"], secondary: ["design_creative", "cooking_food"], style: "spender" },
  { name: "Chiara Romano", emoji: "🎪", age: 35, bg: "Italian cultural programmer, organises film nights, art shows, and debates", primary: ["event_organising"], secondary: ["cooking_food", "writing_content"], style: "generous" },
  { name: "Sam Oduya", emoji: "📸", age: 28, bg: "Nigerian videographer creating NS's documentary series", primary: ["photography", "design_creative"], secondary: [], style: "trader" },
  { name: "Dr. Helen Park", emoji: "🧭", age: 51, bg: "Korean-American psychologist offering peer counselling and conflict mediation", primary: ["mentorship_advice", "wellness_healing"], secondary: [], style: "cautious" },
  { name: "François Dupont", emoji: "🗣️", age: 40, bg: "French language teacher and wine enthusiast who runs French dinner nights", primary: ["language_tutoring"], secondary: ["cooking_food", "event_organising"], style: "generous" },
  { name: "Blessing Osagie", emoji: "🎪", age: 26, bg: "Nigerian social media manager, puts NS events on the map", primary: ["event_organising", "writing_content"], secondary: ["photography"], style: "spender" },
  { name: "Mika Virtanen", emoji: "📸", age: 33, bg: "Finnish nature photographer, documents NS's surrounding ecosystem", primary: ["photography"], secondary: ["wellness_healing"], style: "cautious" },
  { name: "Abdul Razak", emoji: "🧭", age: 43, bg: "Malaysian community elder and mediator, deeply respected across NS factions", primary: ["mentorship_advice"], secondary: ["language_tutoring", "event_organising"], style: "generous" },
  { name: "Cleo Papadopoulos", emoji: "🗣️", age: 28, bg: "Greek polyglot and linguistic researcher studying how NS develops shared language", primary: ["language_tutoring", "writing_content"], secondary: [], style: "trader" },
  { name: "Isaiah Moyo", emoji: "🎪", age: 30, bg: "Zimbabwean DJ and event host, brings energy to every NS gathering", primary: ["event_organising", "music_performance"], secondary: [], style: "spender" },
  { name: "Emma Johansson", emoji: "📸", age: 31, bg: "Swedish food photographer who makes NS meals look extraordinary", primary: ["photography"], secondary: ["cooking_food", "design_creative"], style: "trader" },
  { name: "Tariq Hassan", emoji: "🧭", age: 46, bg: "Moroccan life coach specialising in career transitions and purpose-finding", primary: ["mentorship_advice"], secondary: ["wellness_healing"], style: "generous" },
  { name: "Hyun-Ae Lim", emoji: "🗣️", age: 35, bg: "Korean sign language interpreter and accessibility advocate", primary: ["language_tutoring"], secondary: ["mentorship_advice", "event_organising"], style: "generous" },
  { name: "Nina Petrova", emoji: "🎪", age: 27, bg: "Bulgarian art curator, transforms NS spaces for temporary exhibitions", primary: ["event_organising", "design_creative"], secondary: [], style: "trader" },
  { name: "James Kariuki", emoji: "📸", age: 38, bg: "Kenyan photojournalist who covered conflict zones, now capturing peaceful community building", primary: ["photography", "writing_content"], secondary: ["mentorship_advice"], style: "cautious" },
  { name: "Sunita Devi", emoji: "🧭", age: 50, bg: "Indian former school principal, mentors NS's younger members like her own children", primary: ["mentorship_advice"], secondary: ["cooking_food", "wellness_healing"], style: "generous" },
  { name: "Hugo Almeida", emoji: "🗣️", age: 30, bg: "Portuguese-Brazilian teaching Portuguese and running a capoeira group", primary: ["language_tutoring", "fitness_training"], secondary: [], style: "spender" },
  { name: "Anika Müller", emoji: "🎪", age: 29, bg: "German hackathon organiser and community builder, helped design NS's event calendar", primary: ["event_organising"], secondary: ["software_dev"], style: "trader" },
  { name: "Daniel Mensah", emoji: "📸", age: 26, bg: "Ghanaian drone photographer and cinematographer", primary: ["photography"], secondary: ["software_dev"], style: "spender" },
  { name: "Margaret Ochieng", emoji: "🧭", age: 44, bg: "Kenyan HR director turned community facilitator, manages NS's skill-matching", primary: ["mentorship_advice", "event_organising"], secondary: [], style: "cautious" },
  { name: "Ivan Horvat", emoji: "🗣️", age: 37, bg: "Croatian interpreter (5 Slavic languages + English), cultural bridge builder", primary: ["language_tutoring"], secondary: ["writing_content"], style: "cautious" },
  { name: "Amina Diallo", emoji: "🎪", age: 32, bg: "Senegalese cultural coordinator, organises NS's inter-cultural dialogue series", primary: ["event_organising"], secondary: ["language_tutoring", "cooking_food"], style: "generous" },

  // === WELLNESS & LIFESTYLE (35 agents) ===
  { name: "Maya Johnson", emoji: "💪", age: 29, bg: "American CrossFit coach and nutritionist, runs NS's morning workout group", primary: ["fitness_training"], secondary: ["cooking_food"], style: "spender" },
  { name: "Anong Srisai", emoji: "🧘", age: 42, bg: "Thai yoga and meditation teacher, former monk, NS's calmest person", primary: ["wellness_healing"], secondary: ["mentorship_advice", "cooking_food"], style: "generous" },
  { name: "Lucy Wanjiku", emoji: "🐕", age: 24, bg: "Kenyan animal lover, started NS's community pet care system", primary: ["pet_care"], secondary: ["fitness_training", "event_organising"], style: "generous" },
  { name: "João Silva", emoji: "🎵", age: 35, bg: "Brazilian guitarist and samba musician, hosts weekly jam sessions", primary: ["music_performance"], secondary: ["language_tutoring", "event_organising"], style: "spender" },
  { name: "Ava Mitchell", emoji: "💪", age: 27, bg: "Australian personal trainer and surf instructor", primary: ["fitness_training"], secondary: ["wellness_healing"], style: "trader" },
  { name: "Suriya Kaewmanee", emoji: "🧘", age: 50, bg: "Thai traditional massage therapist, everyone books weeks in advance", primary: ["wellness_healing"], secondary: ["cooking_food"], style: "cautious" },
  { name: "Felix Omondi", emoji: "🐕", age: 31, bg: "Kenyan veterinary technician, manages NS's growing pet population health", primary: ["pet_care"], secondary: ["wellness_healing"], style: "generous" },
  { name: "Carmen Delgado", emoji: "🎵", age: 33, bg: "Cuban pianist and music teacher, started NS's community choir", primary: ["music_performance"], secondary: ["event_organising", "language_tutoring"], style: "generous" },
  { name: "Jake Williams", emoji: "💪", age: 25, bg: "American ex-Marine turned fitness mentor, runs NS's obstacle course", primary: ["fitness_training"], secondary: ["mentorship_advice", "handyman_repair"], style: "cautious" },
  { name: "Pranee Wongse", emoji: "🧘", age: 38, bg: "Thai herbalist and traditional healer, makes remedies from local plants", primary: ["wellness_healing"], secondary: ["cooking_food"], style: "generous" },
  { name: "Sophie Laurent", emoji: "🐕", age: 22, bg: "French veterinary student, youngest NS member, runs the dog walking schedule", primary: ["pet_care"], secondary: ["photography", "fitness_training"], style: "spender" },
  { name: "Kwame Owusu", emoji: "🎵", age: 40, bg: "Ghanaian djembe drummer and music therapist, uses rhythm for community bonding", primary: ["music_performance", "wellness_healing"], secondary: ["event_organising"], style: "generous" },
  { name: "Natalie Torres", emoji: "💪", age: 32, bg: "Puerto Rican boxing instructor and self-defence teacher", primary: ["fitness_training"], secondary: ["mentorship_advice"], style: "trader" },
  { name: "Kanya Sriphorn", emoji: "🧘", age: 45, bg: "Thai Reiki practitioner and crystal healer, NS's spiritual anchor", primary: ["wellness_healing"], secondary: ["mentorship_advice"], style: "generous" },
  { name: "Ben Harper", emoji: "🐕", age: 35, bg: "Australian dog trainer and animal behaviourist, socialises NS's rescue dogs", primary: ["pet_care"], secondary: ["mentorship_advice"], style: "cautious" },
  { name: "Esteban Ruiz", emoji: "🎵", age: 28, bg: "Argentine tango musician and DJ, curates NS's ambient playlists", primary: ["music_performance"], secondary: ["event_organising"], style: "spender" },
  { name: "Miriam Tesfaye", emoji: "💪", age: 30, bg: "Ethiopian long-distance runner, organises NS's running club", primary: ["fitness_training"], secondary: ["wellness_healing", "event_organising"], style: "generous" },
  { name: "Dao Somchai", emoji: "🧘", age: 53, bg: "Thai acupuncturist and qi gong instructor, decades of healing experience", primary: ["wellness_healing"], secondary: ["mentorship_advice"], style: "cautious" },
  { name: "Olivia Chen", emoji: "🐕", age: 26, bg: "Singaporean animal rescue volunteer, fosters strays and finds them homes", primary: ["pet_care"], secondary: ["photography", "event_organising"], style: "generous" },
  { name: "Mateo Vargas", emoji: "🎵", age: 36, bg: "Colombian beatboxer and music producer, builds NS's soundscape", primary: ["music_performance"], secondary: ["software_dev", "event_organising"], style: "trader" },
  { name: "Zoe Papadimitriou", emoji: "💪", age: 28, bg: "Greek martial arts instructor and meditation practitioner", primary: ["fitness_training", "wellness_healing"], secondary: [], style: "cautious" },
  { name: "Niran Patel", emoji: "🧘", age: 41, bg: "Indian Ayurvedic doctor practising holistic wellness at NS", primary: ["wellness_healing"], secondary: ["cooking_food", "mentorship_advice"], style: "generous" },
  { name: "Charlie Dawson", emoji: "🐕", age: 29, bg: "New Zealand farm boy, manages NS's small animal garden", primary: ["pet_care"], secondary: ["handyman_repair", "cooking_food"], style: "spender" },
  { name: "Luna Kim", emoji: "🎵", age: 24, bg: "Korean K-pop dance instructor and choreographer", primary: ["music_performance", "fitness_training"], secondary: ["event_organising"], style: "spender" },
  { name: "Robert Tanui", emoji: "💪", age: 34, bg: "Kenyan marathon coach, trains NS members for their first 10K", primary: ["fitness_training"], secondary: ["mentorship_advice"], style: "generous" },
  { name: "Manee Chaiyaphum", emoji: "🧘", age: 48, bg: "Thai meditation retreat leader, hosts silent weekends at NS", primary: ["wellness_healing"], secondary: ["mentorship_advice", "cooking_food"], style: "cautious" },
  { name: "Ruby Nakamura", emoji: "🐕", age: 27, bg: "Japanese-Canadian certified dog groomer and pet first-aid trainer", primary: ["pet_care"], secondary: ["wellness_healing"], style: "generous" },
  { name: "Leo Fernández", emoji: "🎵", age: 31, bg: "Spanish flamenco guitarist and busking veteran", primary: ["music_performance"], secondary: ["language_tutoring"], style: "spender" },
  { name: "Aisha Mohammed", emoji: "💪", age: 33, bg: "Somali-British yoga instructor blending traditional movement with modern fitness", primary: ["fitness_training", "wellness_healing"], secondary: [], style: "generous" },
  { name: "Wipawan Tangsri", emoji: "🧘", age: 35, bg: "Thai aromatherapist making essential oils from local botanicals", primary: ["wellness_healing"], secondary: ["crafting_building"], style: "trader" },
  { name: "Max Bergström", emoji: "🐕", age: 30, bg: "Swedish search-and-rescue dog handler, most popular person among NS pets", primary: ["pet_care"], secondary: ["fitness_training", "handyman_repair"], style: "cautious" },
  { name: "Paloma Reyes", emoji: "🎵", age: 29, bg: "Mexican folk singer and songwriter, writes songs about NS life", primary: ["music_performance", "writing_content"], secondary: [], style: "generous" },

  // === MIXED / GENERALISTS / WILDCARDS (35 agents) ===
  { name: "Alex Tan", emoji: "🌏", age: 30, bg: "Singaporean serial dabbler — codes a bit, cooks a bit, fixes things, mediates conflicts", primary: ["software_dev", "cooking_food", "handyman_repair"], secondary: ["mentorship_advice"], style: "trader" },
  { name: "Jordan Rivera", emoji: "🦄", age: 26, bg: "Non-binary American artist-engineer hybrid, builds interactive installations", primary: ["software_dev", "design_creative", "crafting_building"], secondary: [], style: "spender" },
  { name: "Nia Osei-Bonsu", emoji: "🌟", age: 35, bg: "Ghanaian-Dutch social entrepreneur, connects people and creates unlikely collaborations", primary: ["event_organising", "mentorship_advice"], secondary: ["writing_content", "cooking_food"], style: "generous" },
  { name: "Samir Khoury", emoji: "🎭", age: 39, bg: "Lebanese performance artist and former banker, the most unpredictable person at NS", primary: ["music_performance", "event_organising"], secondary: ["mentorship_advice", "cooking_food"], style: "spender" },
  { name: "Petra Novotná", emoji: "🔬", age: 43, bg: "Czech biologist turned permaculture designer, building NS's food garden", primary: ["wellness_healing", "cooking_food"], secondary: ["mentorship_advice", "writing_content"], style: "cautious" },
  { name: "Idris Bah", emoji: "⚡", age: 22, bg: "Gambian self-taught coder and electrician, youngest fixer in the community", primary: ["software_dev", "handyman_repair"], secondary: [], style: "spender" },
  { name: "Valentina Rossi", emoji: "🎭", age: 34, bg: "Italian theatre director running NS's improv group and storytelling nights", primary: ["event_organising", "writing_content"], secondary: ["language_tutoring", "mentorship_advice"], style: "generous" },
  { name: "Wai Yan Aung", emoji: "🏗️", age: 28, bg: "Myanmar civil engineer, helps with NS's physical expansion and renovations", primary: ["handyman_repair", "crafting_building"], secondary: ["software_dev"], style: "cautious" },
  { name: "Sade Williams", emoji: "🎤", age: 27, bg: "British-Nigerian spoken word poet and community radio host", primary: ["writing_content", "music_performance"], secondary: ["event_organising"], style: "generous" },
  { name: "Piotr Zielinski", emoji: "🏋️", age: 36, bg: "Polish powerlifter and motivational speaker, loudest laugh at NS", primary: ["fitness_training", "mentorship_advice"], secondary: ["cooking_food"], style: "spender" },
  { name: "Yara Nasser", emoji: "🌿", age: 31, bg: "Palestinian botanist growing medicinal herbs and teaching plant care", primary: ["wellness_healing", "crafting_building"], secondary: ["cooking_food"], style: "cautious" },
  { name: "Dante Colombo", emoji: "🍕", age: 44, bg: "Italian restaurateur, makes pizza in the outdoor oven he built himself", primary: ["cooking_food", "handyman_repair"], secondary: ["event_organising"], style: "generous" },
  { name: "Keiko Mori", emoji: "📖", age: 48, bg: "Japanese librarian and knowledge curator, manages NS's physical and digital library", primary: ["writing_content", "mentorship_advice"], secondary: ["language_tutoring"], style: "cautious" },
  { name: "Tendai Moyo", emoji: "🏃", age: 25, bg: "Zimbabwean sprinter and sports coach, energises everyone around him", primary: ["fitness_training"], secondary: ["event_organising", "music_performance"], style: "spender" },
  { name: "Astrid Holm", emoji: "🧊", age: 37, bg: "Danish cold-exposure coach and sauna builder, runs NS's ice bath rituals", primary: ["wellness_healing", "crafting_building"], secondary: ["fitness_training"], style: "trader" },
  { name: "Bram van Dijk", emoji: "🚴", age: 29, bg: "Dutch bicycle mechanic and urban planning enthusiast", primary: ["transport_errands", "handyman_repair"], secondary: ["design_creative"], style: "trader" },
  { name: "Esther Amoah", emoji: "💃", age: 33, bg: "Ghanaian dance teacher, runs Afrobeats classes every morning", primary: ["fitness_training", "music_performance"], secondary: ["event_organising"], style: "generous" },
  { name: "Nikolai Sokolov", emoji: "♟️", age: 52, bg: "Russian chess grandmaster turned strategic advisor, plays everyone at NS simultaneously", primary: ["mentorship_advice"], secondary: ["writing_content"], style: "hoarder" },
  { name: "Farah Idris", emoji: "🌺", age: 30, bg: "Malaysian-Malay florist and garden designer, makes NS beautiful", primary: ["crafting_building", "wellness_healing"], secondary: ["photography"], style: "generous" },
  { name: "Cillian Murphy", emoji: "🎸", age: 26, bg: "Irish busker and guitar teacher, plays in NS's house band", primary: ["music_performance"], secondary: ["language_tutoring", "cooking_food"], style: "spender" },
  { name: "Rina Sato", emoji: "🧪", age: 40, bg: "Japanese fermentation scientist, makes miso, kombucha, and kimchi for NS", primary: ["cooking_food"], secondary: ["wellness_healing", "writing_content"], style: "cautious" },
  { name: "Otis Freeman", emoji: "🎨", age: 45, bg: "American muralist and art teacher, painted NS's iconic entrance wall", primary: ["design_creative", "crafting_building"], secondary: ["mentorship_advice"], style: "generous" },
  { name: "Vivian Ng", emoji: "🏊", age: 28, bg: "Malaysian former competitive swimmer, now teaches water safety and swim lessons", primary: ["fitness_training"], secondary: ["pet_care"], style: "trader" },
  { name: "Henrik Berg", emoji: "🔊", age: 34, bg: "Norwegian sound engineer who built NS's podcast studio and event PA system", primary: ["crafting_building", "software_dev"], secondary: ["music_performance"], style: "hoarder" },
  { name: "Dina Haddad", emoji: "🌙", age: 38, bg: "Egyptian astrologer and life coach, the most booked person for 1-on-1s", primary: ["mentorship_advice", "wellness_healing"], secondary: [], style: "generous" },
  { name: "Tunde Bakare", emoji: "📻", age: 32, bg: "Nigerian podcast host interviewing every NS member for the community archive", primary: ["writing_content", "photography"], secondary: ["event_organising"], style: "trader" },
  { name: "Mira Petrović", emoji: "🧵", age: 41, bg: "Serbian costume designer who creates themed outfits for NS events", primary: ["crafting_building", "design_creative"], secondary: ["event_organising"], style: "generous" },
  { name: "Oscar Lindström", emoji: "🎯", age: 23, bg: "Swedish competitive gamer trying to build NS's e-sports team", primary: ["software_dev"], secondary: ["event_organising"], style: "spender" },
  { name: "Amara Conteh", emoji: "🌾", age: 47, bg: "Sierra Leonean farmer and permaculture teacher, grows food on NS grounds", primary: ["cooking_food", "wellness_healing"], secondary: ["mentorship_advice"], style: "generous" },
  { name: "Youssef Ben Ali", emoji: "☕", age: 36, bg: "Tunisian barista and coffee roaster, runs NS's beloved coffee cart", primary: ["cooking_food"], secondary: ["event_organising", "language_tutoring"], style: "trader" },
  { name: "Kim Dao", emoji: "🎎", age: 29, bg: "Vietnamese cultural ambassador, organises Tet and Mid-Autumn festivals", primary: ["event_organising"], secondary: ["cooking_food", "crafting_building"], style: "generous" },
  { name: "Patrick Okafor", emoji: "⚽", age: 24, bg: "Nigerian football coach, organises inter-community matches every Sunday", primary: ["fitness_training", "event_organising"], secondary: [], style: "spender" },
  { name: "Saskia de Vries", emoji: "📚", age: 46, bg: "Dutch educator designing NS's internal learning curriculum", primary: ["mentorship_advice", "writing_content"], secondary: ["event_organising"], style: "cautious" },
  { name: "Rico Santos", emoji: "🎵", age: 31, bg: "Filipino karaoke champion and music teacher, keeps NS spirits high", primary: ["music_performance"], secondary: ["event_organising", "cooking_food"], style: "generous" },
  { name: "Zainab Osman", emoji: "🧘", age: 39, bg: "Sudanese mindfulness practitioner and conflict resolution specialist", primary: ["wellness_healing", "mentorship_advice"], secondary: ["language_tutoring"], style: "cautious" },
];

function rand(min, max) { return Math.round((Math.random() * (max - min) + min) * 100) / 100; }

function generateAgent(profile, index) {
  const skills = {};
  const needsTendency = {};

  SKILL_KEYS.forEach(key => {
    let level = 0;
    if (profile.primary.includes(key)) level = rand(0.7, 0.95);
    else if (profile.secondary && profile.secondary.includes(key)) level = rand(0.3, 0.6);
    else if (Math.random() < 0.08) level = rand(0.1, 0.25); // small random chance of minor skill
    skills[key] = level;

    // Needs are roughly inverse of skills + some randomness
    if (level < 0.2 && Math.random() < 0.25) {
      needsTendency[key] = rand(0.3, 0.8);
    } else if (level < 0.5 && Math.random() < 0.15) {
      needsTendency[key] = rand(0.2, 0.5);
    } else {
      needsTendency[key] = 0;
    }
  });

  const personality = {
    openness: rand(0.2, 0.95),
    reliability: rand(0.25, 0.95),
    generosity: profile.style === "generous" ? rand(0.6, 0.95) : profile.style === "hoarder" ? rand(0.15, 0.4) : rand(0.3, 0.7),
    risk_tolerance: profile.style === "spender" ? rand(0.5, 0.9) : profile.style === "cautious" ? rand(0.1, 0.4) : rand(0.3, 0.7),
    social_drive: rand(0.3, 0.9),
  };

  // ~20% high fiat preference, ~30% low, rest middle
  let fiatPreference;
  if (Math.random() < 0.2) fiatPreference = rand(0.7, 0.95);
  else if (Math.random() < 0.4) fiatPreference = rand(0.05, 0.3);
  else fiatPreference = rand(0.3, 0.7);

  // ~10% unreliable
  if (Math.random() < 0.1) personality.reliability = rand(0.15, 0.35);

  const initialRep = personality.reliability * 0.5 + 0.25;

  return {
    id: "agent_" + String(index + 1).padStart(3, "0"),
    name: profile.name,
    emoji: profile.emoji,
    age: profile.age,
    background: profile.bg,
    personality,
    skills,
    needs_tendency: needsTendency,
    economic_style: profile.style,
    fiatPreference,
    reputation: { overall: initialRep, byCategory: {} },
    tokens: {
      issued: 0,
      redeemed: 0,
      held: [],
      weeklyCapacity: 10 + Math.floor(personality.social_drive * 5),
      remainingCapacity: 10 + Math.floor(personality.social_drive * 5),
    },
    fiatBalance: 1000,
    marketPrice: initialRep,
    isActive: true,
    redemptionSpeed: personality.reliability * 0.6 + 0.3,
  };
}

const agents = PROFILES.map((p, i) => generateAgent(p, i));

const fs = require("fs");
const dir = "src/data";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/seedAgents.json", JSON.stringify(agents, null, 2));

// Stats
const styles = {};
agents.forEach(a => { styles[a.economic_style] = (styles[a.economic_style] || 0) + 1; });
const fiatSkeptics = agents.filter(a => a.fiatPreference < 0.3).length;
const fiatLovers = agents.filter(a => a.fiatPreference > 0.7).length;
const unreliable = agents.filter(a => a.personality.reliability < 0.4).length;

console.log("✨ Generated " + agents.length + " agents → " + dir + "/seedAgents.json");
console.log("   Economic styles:", JSON.stringify(styles));
console.log("   Token enthusiasts: " + fiatSkeptics);
console.log("   Fiat loyalists: " + fiatLovers);
console.log("   Unreliable (will default): " + unreliable);

const skillCounts = {};
SKILL_KEYS.forEach(key => { skillCounts[key] = agents.filter(a => a.skills[key] > 0.5).length; });
console.log("\n   Skill distribution (agents with >0.5):");
Object.entries(skillCounts).sort((a,b) => b[1]-a[1]).forEach(([skill, count]) => {
  console.log("   " + skill.padEnd(22) + String(count).padStart(3) + " " + "█".repeat(Math.round(count/2)));
});
