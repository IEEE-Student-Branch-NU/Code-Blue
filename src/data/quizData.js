const quizQuestions = [
  // ─── IEEE SBNU & SECTION SPECIFIC ───
  {
    id: 1,
    question: "Which IEEE Society does IEEE SBNU primarily coordinate with for technical seminars?",
    options: ["Computer Society", "Robotics & Automation", "Power & Energy", "Circuits & Systems"],
    correctAnswer: "Computer Society"
  },
  {
    id: 2,
    question: "What is the unique IEEE Student Branch Code for Nirma University?",
    options: ["STB63584", "STB12345", "STB00987", "STB98765"],
    correctAnswer: "STB63584"
  },
  {
    id: 3,
    question: "How many major tech events are featured in this Carnival Guide?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4"
  },
  {
    id: 4,
    question: "Which Nirma event involves 'Lambda Expressions' as a central theme?",
    options: ["ITSS", "RoboSumo", "Lambda Genie", "Lumisense"],
    correctAnswer: "Lambda Genie"
  },
  {
    id: 5,
    question: "Which position is responsible for the overall SBNU web presence like this quiz?",
    options: ["Chairperson", "Webmaster", "Secretary", "Editorial Head"],
    correctAnswer: "Webmaster"
  },

  // ─── ELITE COMPUTER SCIENCE & ENGINEERING ───
  {
    id: 6,
    question: "In Transformer architecture, what is the 'Attention' mechanism's primary role?",
    options: ["Focus on relevant input segments", "Compress audio data", "Increase GPU load", "Reverse bit order"],
    correctAnswer: "Focus on relevant input segments"
  },
  {
    id: 7,
    question: "What is the primary engine used in the Chromium browser for JavaScript?",
    options: ["SpiderMonkey", "V8", "JavaScriptCore", "Chakra"],
    correctAnswer: "V8"
  },
  {
    id: 8,
    question: "Which protocol ensures a 'Three-Way Handshake' for reliable transport?",
    options: ["UDP", "TCP/IP", "HTTP", "ICMP"],
    correctAnswer: "TCP/IP"
  },
  {
    id: 9,
    question: "What is the space complexity of a recursively implemented Fibonacci sequence?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(n)"
  },
  {
    id: 10,
    question: "Which OS kernel is known for its pure monolithic architecture?",
    options: ["Hurd", "Linux", "Windows NT", "Mach"],
    correctAnswer: "Linux"
  },

  // ─── AI & FUTURE TECH ───
  {
    id: 11,
    question: "Who is credited with inventing the 'Transformer' model architecture?",
    options: ["OpenAI", "Google Research", "Meta AI", "Microsoft"],
    correctAnswer: "Google Research"
  },
  {
    id: 12,
    question: "What does the 'G' in GPT (Generative Pre-trained Transformer) stand for?",
    options: ["Global", "Generative", "Gradual", "Graphic"],
    correctAnswer: "Generative"
  },
  {
    id: 13,
    question: "Which Python library is the industry standard for Tensor computations?",
    options: ["Pandas", "Matplotlib", "PyTorch", "Django"],
    correctAnswer: "PyTorch"
  },
  {
    id: 14,
    question: "What is 'RLHF' in the context of tuning AI models like ChatGPT?",
    options: ["Reinforcement Learning from Human Feedback", "Rapid Logic High Frequency", "Recursive Loop Host File", "Reduced Link Handler Flow"],
    correctAnswer: "Reinforcement Learning from Human Feedback"
  },
  {
    id: 15,
    question: "Which AI benchmark measures a model's ability to reason like a human?",
    options: ["Turing Test", "MMLU", "ImageNet", "MNIST"],
    correctAnswer: "MMLU"
  },

  // ─── CARNIVAL EVENT TRIVIA (DEEP) ───
  {
    id: 16,
    question: "In RoboSumo, what is the standard diameter of the competition 'Dohyo'?",
    options: ["77cm", "100cm", "154cm", "200cm"],
    correctAnswer: "154cm"
  },
  {
    id: 17,
    question: "In Lumisense, what type of waves are typically used for detecting proximity?",
    options: ["Ultraviolet", "Infrared", "Gamma", "X-Ray"],
    correctAnswer: "Infrared"
  },
  {
    id: 18,
    question: "In ITSS Phase 2, what is the primary focus for technical session series?",
    options: ["Design Thinking", "Problem Solving", "Networking", "Deployment"],
    correctAnswer: "Problem Solving"
  },
  {
    id: 19,
    question: "The 'Tech Hunt' scavenger clues are hidden using which physical medium?",
    options: ["Base64 Strings", "SHA-256 Hashes", "Invisible Ink", "QR Codes"],
    correctAnswer: "QR Codes"
  },
  {
    id: 20,
    question: "Which organization provided the core logistical support for this Carnival?",
    options: ["Texas Instruments", "IEEE Gujarat Section", "ST Micro", "IEEE SBNU"],
    correctAnswer: "IEEE SBNU"
  },

  // ─── ELITE NETWORK & WEB ───
  {
    id: 21,
    question: "What is the primary purpose of 'Docker' containers in modern DevOps?",
    options: ["Isolating app environments", "Storing large databases", "Compressing assets", "Protecting against DDoS"],
    correctAnswer: "Isolating app environments"
  },
  {
    id: 22,
    question: "Which HTTP status code represents an 'Internal Server Error'?",
    options: ["404", "500", "403", "502"],
    correctAnswer: "500"
  },
  {
    id: 23,
    question: "What is the 'Same-Origin Policy' designed to prevent in browsers?",
    options: ["DNS Hijacking", "Cross-Site Scripting (XSS)", "SQL Injection", "Email Spam"],
    correctAnswer: "Cross-Site Scripting (XSS)"
  },
  {
    id: 24,
    question: "Which CSS layout engine is based on a 'Two-Dimensional' grid system?",
    options: ["Flexbox", "Grid", "Tables", "Floats"],
    correctAnswer: "Grid"
  },
  {
    id: 25,
    question: "What is the main advantage of 'React' using a Virtual DOM?",
    options: ["Less RAM usage", "Minimizing UI re-renders", "Faster server speed", "Better SEO headers"],
    correctAnswer: "Minimizing UI re-renders"
  },

  // ─── SEMICONDUCTORS & HARDWARE (PRO) ───
  {
    id: 26,
    question: "What does 'RISC' stand for in CPU micro-architecture?",
    options: ["Reduced Instruction Set Computer", "Rapid Integrated System Circuit", "Read-only Integrated Chip", "Relational Internal Core"],
    correctAnswer: "Reduced Instruction Set Computer"
  },
  {
    id: 27,
    question: "Which Dutch company controls the world's EUV Photolithography market?",
    options: ["Intel", "Samsung", "ASML", "NXP"],
    correctAnswer: "ASML"
  },
  {
    id: 28,
    question: "What is the unit of measure for CPU 'Clock Cycle Frequency'?",
    options: ["GB/s", "Ghz", "Watts", "Mhz"],
    correctAnswer: "Ghz"
  },
  {
    id: 29,
    question: "Which logic gate outputs TRUE only when both inputs are identical and TRUE?",
    options: ["OR", "NAND", "XOR", "AND"],
    correctAnswer: "AND"
  },
  {
    id: 30,
    question: "What does 'TDP' stand for in processor heat management?",
    options: ["Total Data Power", "Thermal Design Power", "Transmission Delay Port", "Terminal Data Pin"],
    correctAnswer: "Thermal Design Power"
  },

  // ─── CYBERSECURITY & LOGIC ───
  {
    id: 31,
    question: "What is a 'Zero-Day' vulnerability in cybersecurity?",
    options: ["Exploit found before a fix", "A virus that lasts 24 hours", "A server with no downtime", "An old legacy bug"],
    correctAnswer: "Exploit found before a fix"
  },
  {
    id: 32,
    question: "Which encryption algorithm is the current AES standard used globally?",
    options: ["Rijndael (AES)", "MD5", "Blowfish", "DES"],
    correctAnswer: "Rijndael (AES)"
  },
  {
    id: 33,
    question: "What is 'SQL Injection'primarily aimed at?",
    options: ["Injecting code into database queries", "Installing SQL on a PC", "Deleting a cloud server", "Hacking WiFi"],
    correctAnswer: "Injecting code into database queries"
  },
  {
    id: 34,
    question: "Which protocol is used for encrypted, secure shell access?",
    options: ["Telnet", "SSH", "SFTP", "HTTPS"],
    correctAnswer: "SSH"
  },
  {
    id: 35,
    question: "What does 'MFA' stand for in modern account security?",
    options: ["Multi-Factor Authentication", "Main File Archiver", "Many Factor Access", "Micro Folder Array"],
    correctAnswer: "Multi-Factor Authentication"
  },

  // ─── MODERN TECH TRENDS ───
  {
    id: 36,
    question: "What is the primary consensus mechanism for 'Ethereum 2.0' (The Merge)?",
    options: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Proof of Concept"],
    correctAnswer: "Proof of Stake"
  },
  {
    id: 37,
    question: "Which tech stack is used to build the core IEEE SBNU Carnival web portal?",
    options: ["Vite + React", "Next.js + Tailwind", "WordPress", "Pure PHP"],
    correctAnswer: "Vite + React"
  },
  {
    id: 38,
    question: "What is the core principle of 'Edge Computing'?",
    options: ["Processing data close to its source", "Computing in the cloud", "High-speed space servers", "PC Gaming"],
    correctAnswer: "Processing data close to its source"
  },
  {
    id: 39,
    question: "The Metaverse concept is primarily an integration of which technologies?",
    options: ["VR/AR and Web3", "Social Media", "Video Calls", "Email Protocols"],
    correctAnswer: "VR/AR and Web3"
  },
  {
    id: 40,
    question: "Which tech company acquired the 'GitHub' platform in 2018?",
    options: ["Google", "Microsoft", "Meta", "Amazon"],
    correctAnswer: "Microsoft"
  },

  // ─── ENGINEERING MATH & LOGIC ───
  {
    id: 41,
    question: "What is the 'Golden Ratio' (phi) used in design and nature?",
    options: ["1.414", "1.618", "2.718", "3.141"],
    correctAnswer: "1.618"
  },
  {
    id: 42,
    question: "Which Boolean operation corresponds to 'Exclusive OR' logic?",
    options: ["AND", "OR", "XOR", "NAND"],
    correctAnswer: "XOR"
  },
  {
    id: 43,
    question: "What is a 'Heuristic' in the context of algorithmic problem solving?",
    options: ["Approximation for speed", "Precise mathematical proof", "Cloud storage", "Measuring CPU heat"],
    correctAnswer: "Approximation for speed"
  },
  {
    id: 44,
    question: "What does 'Shannon Entropy' measure in information theory?",
    options: ["Uncertainty or Information density", "Physics pressure", "Water flow", "Electricity resistance"],
    correctAnswer: "Uncertainty or Information density"
  },
  {
    id: 45,
    question: "Which sequence starts with 0, 1 and each number is the sum of two previous ones?",
    options: ["Prime", "Fibonacci", "Pascal", "Binary"],
    correctAnswer: "Fibonacci"
  },

  // ─── LAST SET ───
  {
    id: 46,
    question: "What is the name of the first supercomputer officially developed in India?",
    options: ["PARAM 8000", "AIRAVAT", "SAHASRAT", "PRATYUSH"],
    correctAnswer: "PARAM 8000"
  },
  {
    id: 47,
    question: "Who is the principal inventor of the 'World Wide Web' (WWW)?",
    options: ["Steve Jobs", "Tim Berners-Lee", "Bill Gates", "Linus Torvalds"],
    correctAnswer: "Tim Berners-Lee"
  },
  {
    id: 48,
    question: "What was the technical cause of the 'Y2K bug'?",
    options: ["Two-digit year storage", "Satellite millisecond clock", "Zero bandwidth", "Hardware melting"],
    correctAnswer: "Two-digit year storage"
  },
  {
    id: 49,
    question: "Which search giant was originally codenamed 'BackRub' at Stanford?",
    options: ["Google", "Amazon", "Microsoft", "Yahoo"],
    correctAnswer: "Google"
  },
  {
    id: 50,
    question: "Which language is primarily utilized for the 'C++' backend of modern LLMs?",
    options: ["Python", "C++", "Java", "Lisp"],
    correctAnswer: "C++"
  }
];

export default quizQuestions;
