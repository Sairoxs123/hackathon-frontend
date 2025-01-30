import axios from "axios";

const sendRequest = (method, url, data, config) => {
  function caesarCipher(text, key) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const shift = key.length;
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase();
      const isLetter = alphabet.includes(char);

      if (isLetter) {
        const currentIndex = alphabet.indexOf(char);
        const newIndex = (currentIndex + shift) % 26;
        result += alphabet[newIndex];
      } else {
        result += char; // Non-letter characters are unchanged
      }
    }
    return result;
  }

  function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const keywords = ["technology", "innovation", "artificial intelligence", "machine learning", "data science", "software development", "web development", "mobile development", "cloud computing", "cybersecurity", "blockchain", "internet of things", "augmented reality", "virtual reality", "sustainable technology", "green technology", "clean energy", "renewable energy", "climate change", "sustainability", "social impact", "digital transformation", "automation", "robotics", "biotechnology", "nanotechnology", "quantum computing", "future of work", "remote work", "workplace culture", "diversity and inclusion", "mental health", "wellbeing", "work-life balance", "leadership", "management", "teamwork", "communication", "creativity", "innovation", "problem-solving", "critical thinking", "digital literacy", "data privacy", "ethical technology", "responsible AI", "human-centered design", "user experience", "user interface", "design thinking", "product management", "project management", "agile methodology", "devops", "software engineering", "full stack development", "front-end development", "back-end development", "database management", "network engineering", "cybersecurity", "cloud security", "data security", "ethical hacking", "penetration testing", "incident response", "digital forensics", "blockchain security", "IoT security", "AI ethics", "algorithmic bias", "fairness", "transparency", "accountability", "sustainability", "circular economy", "renewable energy", "climate action", "eco-friendly", "green technology", "sustainable development", "social impact", "community engagement", "philanthropy", "nonprofit", "social enterprise", "impact investing", "global citizenship", "cultural diversity", "language learning", "international relations", "global health", "human rights", "social justice", "equity", "inclusion", "diversity", "education", "lifelong learning", "online learning", "e-learning", "STEM education", "digital literacy", "financial literacy", "entrepreneurship", "small business", "startup", "innovation", "business strategy", "marketing", "sales", "customer experience", "digital marketing", "social media marketing", "content marketing", "SEO", "SEM", "email marketing", "data analytics", "business intelligence", "data visualization", "machine learning", "artificial intelligence", "natural language processing", "computer vision", "big data", "data science", "data engineering", "data mining", "data warehousing", "cloud computing", "cloud infrastructure", "cloud security", "cloud architecture", "software development", "software engineering", "agile development", "devops", "full stack development", "front-end development", "back-end development", "web development", "mobile development", "game development", "cybersecurity", "network security", "information security", "ethical hacking", "penetration testing", "incident response", "digital forensics", "blockchain", "cryptocurrency", "smart contracts", "decentralized finance", "NFT", "internet of things", "IoT devices", "IoT security", "IoT applications", "artificial intelligence", "machine learning", "natural language processing", "computer vision", "robotics", "automation", "virtual reality", "augmented reality", "mixed reality", "metaverse", "quantum computing", "biotechnology", "nanotechnology", "genetics", "neuroscience", "bioinformatics", "space exploration", "astronomy", "astrophysics", "climate change", "sustainability", "renewable energy", "green technology", "climate action", "environmental science", "ecology", "conservation", "wildlife conservation", "ocean conservation", "sustainable agriculture", "sustainable fashion", "zero waste", "circular economy", "social impact", "social justice", "human rights", "global health", "education", "lifelong learning", "online learning", "e-learning", "STEM education", "digital literacy", "financial literacy", "entrepreneurship", "small business", "startup", "innovation", "business strategy", "marketing", "sales", "customer experience", "digital marketing", "social media marketing", "content marketing", "SEO", "SEM", "email marketing", "data analytics", "business intelligence", "data visualization", "leadership", "management", "teamwork", "communication", "creativity", "innovation", "problem-solving", "critical thinking", "emotional intelligence", "mental health", "wellbeing", "work-life balance", "diversity and inclusion", "equity", "belonging", "cultural competence", "global citizenship", "language learning", "international relations", "diplomacy", "humanitarian aid", "peacebuilding", "conflict resolution", "social work", "psychology", "sociology", "anthropology", "history", "philosophy", "literature", "art", "music", "film", "theater", "dance", "design", "architecture", "urban planning", "landscape architecture", "interior design", "graphic design", "web design", "UX design", "UI design", "game design", "fashion design", "product design", "industrial design", "photography", "videography", "journalism", "writing", "editing", "publishing", "public relations", "advertising", "marketing communications", "brand management", "digital media", "social media", "content creation", "influencer marketing", "e-commerce", "retail", "supply chain management", "logistics", "operations management", "finance", "accounting", "economics", "investment", "banking", "insurance", "real estate", "law", "business law", "corporate law", "intellectual property law", "tax law", "criminal law", "constitutional law", "international law", "human rights law", "environmental law", "health law", "education law", "labor law", "family law", "criminal justice", "corrections", "probation and parole", "police science", "forensic science", "cybersecurity", "national security", "intelligence analysis", "counterterrorism", "military science", "geopolitics", "international relations", "diplomacy", "foreign policy", "political science", "public policy", "public administration", "government", "politics", "elections", "public opinion", "civic engagement", "social movements", "activism", "nonprofit", "philanthropy", "volunteerism", "community development", "social work", "mental health", "public health", "healthcare", "medicine", "nursing"]
  if (method == "get") {
    return axios.get(`http://127.0.0.1:8000${url}`).then((res) => { return res.data })
  } else {
    const randomKeyword = getRandomElement(keywords);
    let encryptedData = "";
    encryptedData = caesarCipher(randomKeyword, "sai teja sagiraju");
    data.append("encrypted", encryptedData);
    return axios.post(`http://127.0.0.1:8000${url}`, data, config)
    .then((res) => {
      return res.data
    })
  }
};

export default sendRequest;
