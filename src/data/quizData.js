const techQuizData = [
  // ─── IEEE & SBNU TECHNICAL SECTION ───
  {
    id: 1,
    question: "Which IEEE Standard governs the specifications for Wireless Local Area Networks (WLAN)?",
    options: ["IEEE 802.3", "IEEE 802.11", "IEEE 802.15", "IEEE 802.1"],
    correctAnswer: "IEEE 802.11"
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
    question: "Which IEEE Society is primarily focused on the theory and application of robots and automation?",
    options: ["Computer Society", "RAS (Robotics & Automation Society)", "Power & Energy", "Circuits & Systems"],
    correctAnswer: "RAS (Robotics & Automation Society)"
  },
  {
    id: 5,
    question: "What is the primary global mission statement of IEEE?",
    options: ["Advancing Technology for Humanity", "Building Faster Microchips", "Increasing Global Connectivity", "Standardizing the Web"],
    correctAnswer: "Advancing Technology for Humanity"
  },

  // ─── CORE HARDWARE & SEMICONDUCTORS ───
  {
    id: 6,
    question: "Which material is used as the 'Gate Dielectric' in modern High-K Metal Gate transistors?",
    options: ["Silicon Dioxide", "Hafnium Oxide", "Gallium Nitride", "Germanium"],
    correctAnswer: "Hafnium Oxide"
  },
  {
    id: 7,
    question: "What does ' Moore's Law' predict for integrated circuit development?",
    options: ["Costs decrease by half every year", "Transistors in an IC double every 2 years", "Memory density stays constant", "CPU size gets smaller"],
    correctAnswer: "Transistors in an IC double every 2 years"
  },
  {
    id: 8,
    question: "Which communication protocol uses a 2-wire interface (SDA and SCL)?",
    options: ["SPI", "I2C", "UART", "USB"],
    correctAnswer: "I2C"
  },
  {
    id: 9,
    question: "What is the purpose of an 'Op-Amp' (Operational Amplifier) in a circuit?",
    options: ["DC Volts storage", "Signal amplification and filtering", "Bit correction", "WiFi connectivity"],
    correctAnswer: "Signal amplification and filtering"
  },
  {
    id: 10,
    question: "Which semiconductor has a wider 'Bandgap' than Silicon, suitable for high-power E-vehicles?",
    options: ["Germanium", "Gallium Arsenide", "Silicon Carbide (SiC)", "Copper"],
    correctAnswer: "Silicon Carbide (SiC)"
  },

  // ─── ENGINEERING SYSTEMS & SIGNAL PROCESSING ───
  {
    id: 11,
    question: "In Control Systems, what does 'PID' stand for?",
    options: ["Proportional-Integral-Derivative", "Point-Insert-Display", "Parallel-Internal-Driver", "Process-Input-Data"],
    correctAnswer: "Proportional-Integral-Derivative"
  },
  {
    id: 12,
    question: "What is the 'Nyquist Frequency' for a signal sampling rate of 44.1 kHz?",
    options: ["11.025 kHz", "22.05 kHz", "88.2 kHz", "44.1 kHz"],
    correctAnswer: "22.05 kHz"
  },
  {
    id: 13,
    question: "Which algorithm is commonly used for efficient 'Fast Fourier Transform' (FFT)?",
    options: ["Dijkstra", "Cooley-Tukey", "Bellman-Ford", "Merge Sort"],
    correctAnswer: "Cooley-Tukey"
  },
  {
    id: 14,
    question: "In Digital Signal Processing, what is a 'FIR' filter?",
    options: ["Finite Impulse Response", "Flexible Internal Router", "Fast Input Response", "Frequency Integrated Range"],
    correctAnswer: "Finite Impulse Response"
  },
  {
    id: 15,
    question: "What is the primary function of a 'PLL' (Phase-Locked Loop) in a digital system?",
    options: ["Measuring Heat", "Frequency Synthesis and Clock Sync", "Voltage Storage", "Image Rendering"],
    correctAnswer: "Frequency Synthesis and Clock Sync"
  },

  // ─── CARNIVAL LOGISTICS & TECH CHALLENGES ───
  {
    id: 16,
    question: "In the 'RoboSumo' Carnival event, what is the 'Dohyo' border color?",
    options: ["Red", "White", "Yellow", "Blue"],
    correctAnswer: "White"
  },
  {
    id: 17,
    question: "Which Nirma event involves 'Lambda Genie' as a logic and coding challenge?",
    options: ["ITSS", "RoboSumo", "Lumisense", "Lambda Genie"],
    correctAnswer: "Lambda Genie"
  },
  {
    id: 18,
    question: "The 'Tech Hunt' scavenger clues are hidden using which physical tech medium?",
    options: ["Base64 Strings", "Invisible Ink", "QR Codes", "NFC Tags"],
    correctAnswer: "QR Codes"
  },
  {
    id: 19,
    question: "In 'Lumisense', what type of sensor provides the core data input?",
    options: ["Light/Proximity", "Sound", "Heat", "Touch"],
    correctAnswer: "Light/Proximity"
  },
  {
    id: 20,
    question: "What does 'ITSS' stand for in the context of the SBNU event series?",
    options: ["Interactive Technical Session Series", "International Tech Student Summit", "Integrated Technology System", "Innovative Technical Science Society"],
    correctAnswer: "Interactive Technical Session Series"
  },

  // ─── MODERN AI & COMPUTATIONAL ELITE ───
  {
    id: 21,
    question: "In LLM architecture (like GPT-4), which layer is responsible for calculating weighted relationships between words?",
    options: ["Transformer Self-Attention", "ReLU Activation", "Softmax Layer", "Input Embedding"],
    correctAnswer: "Transformer Self-Attention"
  },
  {
    id: 22,
    question: "What is the primary benefit of using 'Docker' containers in system deployment?",
    options: ["Increasing RAM", "Environment isolation and portability", "Data Compression", "DDoS Protection"],
    correctAnswer: "Environment isolation and portability"
  },
  {
    id: 23,
    question: "Which computational complexity class describes problems that can be solved in polynomial time?",
    options: ["P", "NP", "NP-Hard", "EXP"],
    correctAnswer: "P"
  },
  {
    id: 24,
    question: "What is the 'V8 Engine' specialized for in modern browsers?",
    options: ["Rendering CSS", "Interpreting Python", "Compiling JavaScript to Machine Code", "Managing Cookies"],
    correctAnswer: "Compiling JavaScript to Machine Code"
  },
  {
    id: 25,
    question: "Which cloud architecture model allows users to run code without managing servers?",
    options: ["IaaS", "PaaS", "SaaS", "Serverless (FaaS)"],
    correctAnswer: "Serverless (FaaS)"
  },

  // ─── POWER & ENERGY / ELECTRICAL ELITE ───
  {
    id: 26,
    question: "What is the core working principle of a 'Photovoltaic Cell'?",
    options: ["Hall Effect", "Photovoltaic Effect", "Doppler Effect", "Seebeck Effect"],
    correctAnswer: "Photovoltaic Effect"
  },
  {
    id: 27,
    question: "In an AC circuit, what is 'Reactive Power' measured in?",
    options: ["Watts", "VAR (Volt-Ampere Reactive)", "Amperes", "Joules"],
    correctAnswer: "VAR (Volt-Ampere Reactive)"
  },
  {
    id: 28,
    question: "Which motor type is most commonly used in high-performance EVs like Tesla?",
    options: ["Brushed DC", "Stepper Motor", "Permanent Magnet Induction Motor", "Servo Motor"],
    correctAnswer: "Permanent Magnet Induction Motor"
  },
  {
    id: 29,
    question: "What is 'Smart Grid' technology primarily used for?",
    options: ["Watching TV", "Bi-directional flow of data and electricity", "Making fast batteries", "Building faster wires"],
    correctAnswer: "Bi-directional flow of data and electricity"
  },
  {
    id: 30,
    question: "Which logic gate is known as a 'Universal Gate' capable of building any other gate?",
    options: ["AND", "OR", "NAND", "XOR"],
    correctAnswer: "NAND"
  },

  // ─── PURE CYBER & NETWORK ELITE ───
  {
    id: 31,
    question: "Which protocol operates at the 'Network Layer' (Layer 3) of the OSI model?",
    options: ["TCP", "IP", "HTTP", "Ethernet"],
    correctAnswer: "IP"
  },
  {
    id: 32,
    question: "What is the primary function of a 'DHCP' server?",
    options: ["Website Hosting", "Dynamic IP Address assignment", "Email Encryption", "Firewall Protection"],
    correctAnswer: "Dynamic IP Address assignment"
  },
  {
    id: 33,
    question: "Which hashing algorithm is widely used for verifying file integrity (e.g., checksums)?",
    options: ["AES", "RSA", "SHA-256", "DES"],
    correctAnswer: "SHA-256"
  },
  {
    id: 34,
    question: "What does 'S' in HTTPS signify?",
    options: ["Speed", "Secure (via SSL/TLS)", "Script", "System"],
    correctAnswer: "Secure (via SSL/TLS)"
  },
  {
    id: 35,
    question: "Which port is globally reserved for secure 'SSH' remote access?",
    options: ["80", "443", "22", "21"],
    correctAnswer: "22"
  },

  // ─── NIRMA CAMPUS & CARNIVAL LORE ───
  {
    id: 36,
    question: "Which Institute hosted the first major IEEE event at Nirma University?",
    options: ["Institute of Law", "Institute of Technology", "Institute of Pharmacy", "Institute of Mgmt"],
    correctAnswer: "Institute of Technology"
  },
  {
    id: 37,
    question: "What is the maximum time allowed per question in this 'Tech Rush' booth?",
    options: ["10s", "12s", "15s", "20s"],
    correctAnswer: "12s"
  },
  {
    id: 38,
    question: "How many questions must be answered perfectly (8/8) to secure the Master Voucher?",
    options: ["All 8", "7 out of 8", "6 out of 8", "8 out of 50"],
    correctAnswer: "All 8"
  },
  {
    id: 39,
    question: "Which SBNU team was primarily responsible for building this Carnival Interface?",
    options: ["RAS", "Webmaster & Tech Team", "Editorial", "Public Relations"],
    correctAnswer: "Webmaster & Tech Team"
  },
  {
    id: 40,
    question: "The 'Carnival' theme of this event is officially inspired by which atmospheric vibe?",
    options: ["Retro Future", "Spring Festival", "Corporate Summit", "Night Arcade"],
    correctAnswer: "Retro Future"
  },

  // ─── MISC ENGINEERING & PHYSICS ELITE ───
  {
    id: 41,
    question: "What is the value of the 'Boltzmann Constant' (k) in thermodynamics?",
    options: ["1.38 x 10^-23 J/K", "6.626 x 10^-34 J·s", "8.314 J/mol·K", "3.00 x 10^8 m/s"],
    correctAnswer: "1.38 x 10^-23 J/K"
  },
  {
    id: 42,
    question: "Which programming language was specifically designed for performance in the 'Linux Kernel'?",
    options: ["C", "C++", "Java", "Python"],
    correctAnswer: "C"
  },
  {
    id: 43,
    question: "In Aerospace Engineering, what is 'Delta-V'?",
    options: ["Change in Velocity", "Air Flow Density", "Rocket Weight", "Time to Launch"],
    correctAnswer: "Change in Velocity"
  },
  {
    id: 44,
    question: "What is the primary goal of 'Quantum Computing' using Qubits?",
    options: ["Smaller CPUs", "Massively parallel computation via Superposition", "Better Cooling", "Less Power Usage"],
    correctAnswer: "Massively parallel computation via Superposition"
  },
  {
    id: 45,
    question: "Which unit measures ‘Luminous Intensity’ in Electrical engineering?",
    options: ["Candela", "Lumen", "Lux", "Watt"],
    correctAnswer: "Candela"
  },

  // ─── FINAL ELITE TRIVIA ───
  {
    id: 46,
    question: "What is the 'Shannon Limit' used to calculate?",
    options: ["Maximum CPU heat", "Maximum data rate over a noisy channel", "RAM speed", "Battery life"],
    correctAnswer: "Maximum data rate over a noisy channel"
  },
  {
    id: 47,
    question: "In Machine Learning, what is a 'Neural Network' biased by if it recognizes only shadows?",
    options: ["Overfitting", "Underfitting", "Dropout", "Normalization"],
    correctAnswer: "Overfitting"
  },
  {
    id: 48,
    question: "Which component is used to limit current in a circuit perfectly?",
    options: ["Resistor", "Inductor", "Capacitor", "Transistor"],
    correctAnswer: "Resistor"
  },
  {
    id: 49,
    question: "What does 'IoT' stand for?",
    options: ["Internet of Thinking", "Internet of Things", "Internal Online Tech", "Input Output Tool"],
    correctAnswer: "Internet of Things"
  },
  {
    id: 50,
    question: "Which tech giant is known for the first monolithic IC development (alongside Fairchild)?",
    options: ["Intel", "Texas Instruments", "Apple", "Microsoft"],
    correctAnswer: "Texas Instruments"
  }
];

export { techQuizData };
