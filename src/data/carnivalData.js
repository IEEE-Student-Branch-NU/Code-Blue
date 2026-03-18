export const scheduleData = {
  27: { 
    label: '27th', 
    color: 'blue', 
    events: [
      { 
        id: 101, 
        img: '/Carnival/general/inauguration.webp', 
        title: 'Inauguration Ceremony', 
        time: '4:00 - 4:30', 
        type: 'special',
        description: 'The grand opening of IEEE Carnival 2026. Join us as we kick off three days of innovation, competition, and celebration.'
      },
      { 
        id: 1, 
        img: '/Carnival/ITSS.webp', 
        title: 'Next Gen ITSS', 
        time: '4:30 - 6:30', 
        type: 'session',
        description: 'An exclusive session featuring Dr. Maryam Kaveshgar (Global VP of IEEE ITSS) on the innovations driving autonomous systems and global mobility.'
      },
      { 
        id: 2, 
        img: '/Carnival/LUMISENSE.webp', 
        title: 'Lumisense', 
        time: '4:30 - 6:30', 
        type: 'session',
        description: 'This expert talk session will explore the role of photonic sensors as a sustainable technological solution for addressing humanitarian challenges.'
      }
    ] 
  },
  28: { 
    label: '28th', 
    color: 'green', 
    events: [
      { 
        id: 7, 
        img: '/Carnival/AGENTVERSE.webp', 
        title: 'AgentVerse', 
        time: '9:30 - 10:30', 
        type: 'session',
        description: 'An expert-led talkshow exploring swarm intelligence and high-scale decentralized multi-agent system architecture.'
      },
      { 
        id: 5, 
        img: '/Carnival/FGPA WS.webp', 
        title: 'FPGA FORGE', 
        time: '9:30 - 12:30', 
        type: 'session',
        description: 'A hands-on technical workshop on FPGA-based digital system design using Verilog, focusing on practical hardware implementation.'
      },
      { 
        id: 6, 
        img: '/Carnival/DECODE THE CIRCUIT_FORGED IN WIRES.webp', 
        title: 'Forged in Wire', 
        time: '9:30 - 3:30', 
        type: 'session',
        description: 'A circuit decoding challenge. Test your hardware debugging and logic skills to crack the most complex wire-puzzles.'
      },
      { 
        id: 14, 
        img: '/Carnival/IDEATHON.webp', 
        title: 'Ideathon', 
        time: '10:30 - 12:30', 
        type: 'session',
        description: 'A cross-functional innovation challenge to solve campus-related problems using tech, design, and policy frameworks.'
      },
      { id: 102, img: '/Carnival/general/lunch.webp', title: 'Lunch Break', time: '12:30 - 1:30', type: 'break' },
      { 
        id: 8, 
        img: '/Carnival/LAMBDA-GENIE.webp', 
        title: 'Lambda Genie', 
        time: '1:30 - 2:30', 
        type: 'session',
        description: 'An introductory AWS cloud session covering fundamental concepts and real-world deployment strategies using AWS Lambda.'
      },
      { 
        id: 13, 
        img: '/Carnival/2.webp', 
        title: 'Prompt Verse', 
        time: '1:30 - 3:30', 
        type: 'session',
        description: 'A two-stage prompt engineering challenge to master communication with next-gen intelligent AI systems.'
      }
    ] 
  },
  29: { 
    label: '29th', 
    color: 'yellow', 
    events: [
      { 
        id: 9, 
        img: '/Carnival/FGPA WS.webp', 
        title: 'FPGA FORGE', 
        time: '9:30 - 12:30', 
        type: 'session',
        description: 'Day 2 of our intensive FPGA workshop. Dive deeper into hardware synthesis and timing analysis.'
      },
      { 
        id: 10, 
        img: '/Carnival/ROBOWARS.webp', 
        title: 'ROBOSUMO', 
        time: '10:30 - 4:30', 
        type: 'session',
        description: 'The ultimate battle of the bots! Watch autonomous and semi-autonomous humanoids and rovers compete for glory.'
      },
      { id: 103, img: '/Carnival/general/lunch.webp', title: 'Lunch Break', time: '12:30 - 1:30', type: 'break' },
      { 
        id: 11, 
        img: '/Carnival/HIRE_YR_RESEARCH_AGENT.webp', 
        title: 'Hire Your Research Agent', 
        time: '2:30 - 5:30', 
        type: 'session',
        description: 'Explore the world of AI agents in research. Learn how to automate your literature reviews and data synthesis.'
      },
      { 
        id: 12, 
        img: '/Carnival/BOT-TALKS.webp', 
        title: 'Bot Talks', 
        time: '3:30 - 5:30', 
        type: 'session',
        description: 'A series of lightning talks sharing insights from the forefront of robotics and AI integration.'
      },
      { 
        id: 104, 
        img: '/Carnival/general/closing.webp', 
        title: 'Closing Ceremony', 
        time: '5:30 - 6:30', 
        type: 'special',
        description: 'Farewell to IEEE Carnival 2026. Awards presentation, highlights reel, and closing remarks.'
      }
    ] 
  },
};

export const getEventById = (id) => {
  for (const day in scheduleData) {
    const event = scheduleData[day].events.find(e => e.id === parseInt(id));
    if (event) {
      return {
        ...event,
        date: `March ${day}th, 2026`
      };
    }
  }
  return null;
};
