const techQuizData = [
  // ─── IEEE & SBNU SECTION ───
  {
    id: 1,
    question: "What is the primary global mission of IEEE?",
    options: ["Advancing Technology for Humanity", "Making Faster Computers", "Selling Software", "Building Robots"],
    correctAnswer: "Advancing Technology for Humanity"
  },
  {
    id: 2,
    question: "In which year was IEEE SBNU (Student Branch of Nirma University) established?",
    options: ["2000", "2002", "2005", "2010"],
    correctAnswer: "2002"
  },
  {
    id: 3,
    question: "IEEE SBNU falls under which geographic IEEE Region?",
    options: ["Region 8 (Europe)", "Region 1 (USA)", "Region 10 (Asia-Pacific)", "Region 7 (Canada)"],
    correctAnswer: "Region 10 (Asia-Pacific)"
  },
  {
    id: 4,
    question: "Which office-bearer handles the official records and minutes of IEEE SBNU?",
    options: ["Chairperson", "Secretary", "Treasurer", "Webmaster"],
    correctAnswer: "Secretary"
  },
  {
    id: 5,
    question: "What is the official logo color of global IEEE?",
    options: ["Red", "Electric Blue", "Green", "Gold"],
    correctAnswer: "Electric Blue"
  },

  // ─── GLOBAL TECH & INNOVATION ───
  {
    id: 6,
    question: "Who is known as the 'Father of the Indian Space Program'?",
    options: ["APJ Abdul Kalam", "Homi Bhabha", "Vikram Sarabhai", "CV Raman"],
    correctAnswer: "Vikram Sarabhai"
  },
  {
    id: 7,
    question: "Which company created the world's first commercially successful iPhone?",
    options: ["Microsoft", "Google", "Apple", "Samsung"],
    correctAnswer: "Apple"
  },
  {
    id: 8,
    question: "Who is the CEO of SpaceX and Tesla Motors?",
    options: ["Jeff Bezos", "Bill Gates", "Elon Musk", "Tim Cook"],
    correctAnswer: "Elon Musk"
  },
  {
    id: 9,
    question: "Which tech giant's search engine was originally called 'BackRub'?",
    options: ["Google", "Amazon", "Yahoo", "Bing"],
    correctAnswer: "Google"
  },
  {
    id: 10,
    question: "In tech, what does 'AI' stand for?",
    options: ["Aeronautics Intelligence", "Artificial Intelligence", "Automated Information", "Apps Interface"],
    correctAnswer: "Artificial Intelligence"
  },

  // ─── HARDWARE & ELECTRONICS ───
  {
    id: 11,
    question: "Which element is the primary material used in semiconductor chips?",
    options: ["Gold", "Copper", "Silicon", "Carbon"],
    correctAnswer: "Silicon"
  },
  {
    id: 12,
    question: "What does ' Moore's Law' predict for computer chips?",
    options: ["Prices double every year", "Transistors double every 2 years", "Memory stays constant", "CPUs get bigger"],
    correctAnswer: "Transistors double every 2 years"
  },
  {
    id: 13,
    question: "What is the main purpose of a 'Battery Management System' (BMS)?",
    options: ["Increase internet speed", "Limit heat and protect battery", "Make screen brighter", "Add more storage"],
    correctAnswer: "Limit heat and protect battery"
  },
  {
    id: 14,
    question: "Which component is known as the 'Brain' of a computer?",
    options: ["Hard Drive", "RAM", "CPU", "Motherboard"],
    correctAnswer: "CPU"
  },
  {
    id: 15,
    question: "What is the typical base voltage of a standard USB charger?",
    options: ["12V", "3V", "5V", "9V"],
    correctAnswer: "5V"
  },

  // ─── SOFTWARE & DIGITAL WORLD ───
  {
    id: 16,
    question: "Which programming language is most famous for Data Science and AI today?",
    options: ["Java", "C++", "Python", "PHP"],
    correctAnswer: "Python"
  },
  {
    id: 17,
    question: "What does 'HTML' stand for in web development?",
    options: ["High Text Media Line", "HyperText Markup Language", "Heavy Tool Master Link", "Hot Text Main Layout"],
    correctAnswer: "HyperText Markup Language"
  },
  {
    id: 18,
    question: "Which open-source OS was created by Linus Torvalds?",
    options: ["Windows", "macOS", "Linux", "Solaris"],
    correctAnswer: "Linux"
  },
  {
    id: 19,
    question: "What is the 'Cloud' primarily made of?",
    options: ["Satellites", "Remote Data Centers", "The Atmosphere", "Virtual Hard Drives"],
    correctAnswer: "Remote Data Centers"
  },
  {
    id: 20,
    question: "Which tech platform is used for hosting and sharing code globally?",
    options: ["Instagram", "Google Drive", "GitHub", "WhatsApp"],
    correctAnswer: "GitHub"
  },

  // ─── CARNIVAL EVENTS (ITSS, LAMBDA GENIE, ETC.) ───
  {
    id: 21,
    question: "In 'RoboSumo', what must a robot do to win points?",
    options: ["Shoot a ball", "Climb a wire", "Push the opponent out of the ring", "Race to a finish line"],
    correctAnswer: "Push the opponent out of the ring"
  },
  {
    id: 22,
    question: "Which Carnival event involves 'fast-paced coding and logical riddles'?",
    options: ["Lumisense", "ITSS", "Lambda Genie", "Tech Hunt"],
    correctAnswer: "Lambda Genie"
  },
  {
    id: 23,
    question: "The 'Tech Hunt' event is most similar to which real-world activity?",
    options: ["Hackathon", "Scavenger Hunt", "Marathon", "Debate"],
    correctAnswer: "Scavenger Hunt"
  },
  {
    id: 24,
    question: "In the 'Lumisense' event, what provides the main input for sensors?",
    options: ["Light/Proximity", "Sound", "Heat", "Voice"],
    correctAnswer: "Light/Proximity"
  },
  {
    id: 25,
    question: "What does 'ITSS' stand for in the IEEE Nirma event series?",
    options: ["Interactive Technical Session Series", "International Tech Student Summit", "Integrated Technology Smart System", "Innovative Technical Science Society"],
    correctAnswer: "Interactive Technical Session Series"
  },

  // ─── GENERAL TECH TRIVIA (CLEAN & PRO) ───
  {
    id: 26,
    question: "What is the most popular video streaming platform owned by Google?",
    options: ["Netflix", "YouTube", "Hulu", "Disney+"],
    correctAnswer: "YouTube"
  },
  {
    id: 27,
    question: "Which planet is commonly visited by robotic rovers like Perseverance?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    id: 28,
    question: "What is a 'Bit' in computing?",
    options: ["A small piece of hardware", "A binary digit (0 or 1)", "A type of cable", "A computer bug"],
    correctAnswer: "A binary digit (0 or 1)"
  },
  {
    id: 29,
    question: "Which protocol allows us to browse websites securely using encryption?",
    options: ["FTP", "HTTPS", "SMTP", "Telnet"],
    correctAnswer: "HTTPS"
  },
  {
    id: 30,
    question: "What does the 'G' in '5G' stand for?",
    options: ["Gigabyte", "Global", "Generation", "Graphic"],
    correctAnswer: "Generation"
  },

  // ─── ADVANCED (BUT ACCESSIBLE) TECH ───
  {
    id: 31,
    question: "Which type of car engine uses both fuel and electric energy?",
    options: ["Diesel", "Hybrid", "Turbo", "Hydrogen"],
    correctAnswer: "Hybrid"
  },
  {
    id: 32,
    question: "What is the main advantage of 'Solid State Drives' (SSD) over Hard Drives?",
    options: ["More storage", "Less cost", "High-speed data access", "Better colors"],
    correctAnswer: "High-speed data access"
  },
  {
    id: 33,
    question: "Which encryption technology is the foundation for Cryptocurrencies?",
    options: ["Bluetooth", "Blockchain", "GPS", "WiFi"],
    correctAnswer: "Blockchain"
  },
  {
    id: 34,
    question: "Which virtual assistant was developed by Amazon?",
    options: ["Siri", "Cortana", "Alexa", "Bixby"],
    correctAnswer: "Alexa"
  },
  {
    id: 35,
    question: "What does 'PDF' stand for?",
    options: ["Portable Document Format", "Personal Data File", "Printed Data Folder", "Public Document File"],
    correctAnswer: "Portable Document Format"
  },

  // ─── IEEE SBNU Lore ───
  {
    id: 36,
    question: "Where is the IEEE Student Branch (SBNU) located within the campus?",
    options: ["Institute of Law", "Institute of Technology", "Institute of Pharmacy", "Institute of Management"],
    correctAnswer: "Institute of Technology"
  },
  {
    id: 37,
    question: "Which major national festival inspired the 'Carnival' theme?",
    options: ["Holi", "Uttarayan", "Navratri", "Diwali"],
    correctAnswer: "Uttarayan"
  },
  {
    id: 38,
    question: "How many questions must you answer correctly to win this quiz?",
    options: ["6", "7", "8", "All"],
    correctAnswer: "8"
  },
  {
    id: 39,
    question: "Who is the lead organization hosting the multi-domain tech events in the Carnival?",
    options: ["Microsoft", "Google Club", "IEEE SBNU", "SAE"],
    correctAnswer: "IEEE SBNU"
  },
  {
    id: 40,
    question: "What is the primary language used for web apps like this guide?",
    options: ["C++", "Java", "JavaScript", "PHP"],
    correctAnswer: "JavaScript"
  },

  // ─── MISCELLANEOUS TECH ───
  {
    id: 41,
    question: "What was the world's first popular web browser?",
    options: ["Chrome", "Mosaic", "Internet Explorer", "Netscape"],
    correctAnswer: "Mosaic"
  },
  {
    id: 42,
    question: "What is the 'Internet of Things' (IoT)?",
    options: ["Interconnected devices", "A search engine", "Buying things on Amazon", "Social media"],
    correctAnswer: "Interconnected devices"
  },
  {
    id: 43,
    question: "Which company owns 'WhatsApp' and 'Instagram'?",
    options: ["Google", "Microsoft", "Meta", "Amazon"],
    correctAnswer: "Meta"
  },
  {
    id: 44,
    question: "What is 'AR' in technology?",
    options: ["Augmented Reality", "Artificial Robot", "Advanced Radio", "Always Ready"],
    correctAnswer: "Augmented Reality"
  },
  {
    id: 45,
    question: "Which Indian scientist won a Nobel prize for his work on Light Scattering?",
    options: ["Homi Bhabha", "APJ Abdul Kalam", "CV Raman", "S. Ramanujan"],
    correctAnswer: "CV Raman"
  },

  // ─── FINAL STRETCH ───
  {
    id: 46,
    question: "What is 'Bluetooth' named after?",
    options: ["A Blue Flower", "A Viking King", "A Greek God", "A Star"],
    correctAnswer: "A Viking King"
  },
  {
    id: 47,
    question: "Which social media platform's bird logo was named 'Larry'?",
    options: ["Facebook", "Twitter", "Instagram", "Snapchat"],
    correctAnswer: "Twitter"
  },
  {
    id: 48,
    question: "What was the first domain name registered on the Internet?",
    options: ["google.com", "symbolics.com", "apple.com", "ibm.com"],
    correctAnswer: "symbolics.com"
  },
  {
    id: 49,
    question: "In which year did India launch its first satellite, Aryabhata?",
    options: ["1970", "1975", "1980", "1985"],
    correctAnswer: "1975"
  },
  {
    id: 50,
    question: "Which tech giant is known for the slogan 'Think Different'?",
    options: ["Microsoft", "Google", "Apple", "Oracle"],
    correctAnswer: "Apple"
  }
];

export { techQuizData };
