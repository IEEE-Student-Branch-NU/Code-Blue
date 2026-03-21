export const scheduleData = {
  3: {
    label: '3rd April',
    color: 'blue',
    events: [
      {
        id: 101,
        img: '/Carnival/LUMISENSE.webp', // General placeholder for Inauguration if no specific one
        title: 'Inauguration',
        time: '3:00 - 3:30',
        type: 'special',
        location: 'Main Auditorium',
        description: 'The official inauguration ceremony of the IEEE Carnival 2026.'
      },
      {
        id: 201,
        img: '/Carnival/LUMISENSE.webp',
        title: 'Technical Setups & Briefings',
        time: '4:30 - 6:30',
        type: 'session',
        location: 'Lab Complexes',
        description: 'Technical setups for participants, pre-screening for competitions, and introductory briefings.'
      },
      {
        id: 1,
        img: '/Carnival/ITSS.webp',
        title: 'Next Gen ITSS',
        time: '4:30 - 6:30',
        type: 'session',
        location: 'Lecture Hall 1',
        description: 'Professional society session by IEEE ITSS on future mobility.',
        regLink: 'https://konfhub.com/next-gen-intelligent-transportation-systems-expert-lecture'
      },
      {
        id: 2,
        img: '/Carnival/LUMISENSE.webp',
        title: 'Lumisense',
        time: '4:30 - 6:30',
        type: 'session',
        location: 'Optics Lab',
        description: 'Expert lecture on photonic sensors for humanitarian solutions.',
        regLink: 'https://konfhub.com/photonic-sensors-as-a-sustainable-technology-for-humanitarian-solutions'
      }
    ]
  },
  4: {
    label: '4th April',
    color: 'yellow',
    events: [
      {
        id: 5,
        img: '/Carnival/FGPA WS.webp',
        title: 'FPGA FORGE',
        time: '9:30 - 12:30',
        type: 'session',
        location: 'Digital Lab',
        description: 'Hands-on FPGA workshop and design challenge.',
        regLink: 'https://konfhub.com/fpga-forge'
      },
      {
        id: 6,
        img: '/Carnival/DECODE THE CIRCUIT_FORGED IN WIRES.webp',
        title: 'Forged in Wire',
        time: '9:30 - 12:30',
        type: 'session',
        location: 'Electronics Block',
        description: 'The ultimate circuit building and hardware hackathon.',
        regLink: 'https://konfhub.com/forged-in-wire'
      },
      {
        id: 7,
        img: '/Carnival/AGENTVERSE.webp',
        title: 'AgentVerse',
        time: '9:30 - 10:30',
        type: 'session',
        location: 'Main Hall',
        description: 'Swarm AI intelligence and agentic talkshow.',
        regLink: 'https://konfhub.com/swarm-agentic-ai'
      },
      {
        id: 14,
        img: '/Carnival/IDEATHON.webp',
        title: 'Ai Competition',
        time: '10:30 - 11:30',
        type: 'session',
        location: 'Innovation Hub',
        description: 'Artificial Intelligence problem-solving competition.',
        regLink: 'https://konfhub.com/prompt-verse-challenge'
      },
      {
        id: 8,
        img: '/Carnival/LAMBDA-GENIE.webp',
        title: 'Lambda Genie',
        time: '1:30 - 3:30',
        type: 'session',
        location: 'Cloud Lab',
        regLink: 'https://konfhub.com/lambda-genie',
        description: 'Serverless architecture and cloud development.'
      },
      {
        id: 6,
        img: '/Carnival/DECODE THE CIRCUIT_FORGED IN WIRES.webp',
        title: 'Forged in Wire (Part 2)',
        time: '1:30 - 3:30',
        type: 'session',
        location: 'Electronics Block',
        regLink: 'https://konfhub.com/forged-in-wire',
        description: 'Hardware challenge continuation.'
      },
      {
        id: 13,
        img: '/Carnival/2.webp', // Updated correct poster for Prompt Verse
        title: 'Prompt Verse',
        time: '1:30 - 3:30',
        type: 'session',
        location: 'CS Hall',
        regLink: 'https://konfhub.com/prompt-verse-challenge',
        description: 'Master of AI prompt engineering.'
      }
    ]
  },
  5: {
    label: '5th April',
    color: 'green',
    events: [
      {
        id: 5,
        img: '/Carnival/FGPA WS.webp',
        title: 'FPGA FORGE',
        time: '9:30 - 12:30',
        type: 'session',
        location: 'Digital Lab',
        regLink: 'https://konfhub.com/fpga-forge',
        description: 'Workshop finale and final evaluations.'
      },
      {
        id: 10,
        img: '/Carnival/ROBOWARS.webp',
        title: 'ROBOSUMO',
        time: '9:30 - 12:30',
        type: 'session',
        location: 'Arena A',
        regLink: 'https://konfhub.com/robosumo-competition',
        description: 'The robotic gladiator matches.'
      },
      {
        id: 11,
        img: '/Carnival/HIRE_YR_RESEARCH_AGENT.webp',
        title: 'Hire Your Research Agent',
        time: '2:30 - 5:30',
        type: 'session',
        location: 'Research Wing',
        regLink: 'https://konfhub.com/hire-your-first-research-agent',
        description: 'Deploying autonomous AI for research.'
      },
      {
        id: 10,
        img: '/Carnival/ROBOWARS.webp',
        title: 'ROBOSUMO',
        time: '2:30 - 5:30',
        type: 'session',
        location: 'Arena A',
        regLink: 'https://konfhub.com/robosumo-competition',
        description: 'Championship finals.'
      },
      {
        id: 12,
        img: '/Carnival/BOT-TALKS.webp',
        title: 'Bot Talks',
        time: '2:30 - 5:30',
        type: 'session',
        location: 'Exhibit Hall',
        regLink: 'https://konfhub.com/bot-talks',
        description: 'Expert equipment showcases.'
      },
      {
        id: 102,
        img: '/Carnival/LUMISENSE.webp',
        title: 'Prize Distribution & Closing Ceremony',
        time: '5:30 - 6:30',
        type: 'special',
        location: 'Main Arena',
        description: 'The final valediction and rewards ceremony.'
      }
    ]
  }
};

export const getEventById = (id) => {
  for (const day in scheduleData) {
    const event = scheduleData[day].events.find(e => e.id === parseInt(id));
    if (event) return event;
  }
  return null;
};
