export const scheduleData = {
  27: { 
    label: '27th', 
    color: 'blue', 
    events: [
      { id: 101, img: '/Carnival/general/inauguration.webp', title: 'Inauguration Ceremony', time: '4:00 - 4:30', type: 'special' },
      { id: 1, img: '/Carnival/ITSS.webp', title: 'Next Gen ITSS', time: '4:30 - 6:30', type: 'session' },
      { id: 2, img: '/Carnival/LUMISENSE.webp', title: 'Lumisense', time: '4:30 - 6:30', type: 'session' }
    ] 
  },
  28: { 
    label: '28th', 
    color: 'green', 
    events: [
      { id: 7, img: '/Carnival/AGENTVERSE.webp', title: 'AgentVerse', time: '9:30 - 10:30', type: 'session' },
      { id: 5, img: '/Carnival/FGPA WS.webp', title: 'FPGA FORGE', time: '9:30 - 12:30', type: 'session' },
      { id: 6, img: '/Carnival/DECODE THE CIRCUIT_FORGED IN WIRES.webp', title: 'Forged in Wire', time: '10:30 - 3:30', type: 'session' },
      { id: 14, img: '/Carnival/IDEATHON.webp', title: 'Ai Competition', time: '10:30 - 12:30', type: 'session' },
      { id: 102, img: '/Carnival/general/lunch.webp', title: 'Lunch Break', time: '12:30 - 1:30', type: 'break' },
      { id: 8, img: '/Carnival/LAMBDA-GENIE.webp', title: 'Lambda Genie', time: '1:30 - 5:30', type: 'session' },
      { id: 13, img: '/Carnival/2.webp', title: 'Prompt Verse', time: '1:30 - 3:30', type: 'session' }
    ] 
  },
  29: { 
    label: '29th', 
    color: 'yellow', 
    events: [
      { id: 9, img: '/Carnival/FGPA WS.webp', title: 'FPGA FORGE', time: '9:30 - 12:30', type: 'session' },

      { id: 103, img: '/Carnival/general/lunch.webp', title: 'Lunch Break', time: '12:30 - 1:30', type: 'break' },
      { id: 11, img: '/Carnival/HIRE_YR_RESEARCH_AGENT.webp', title: 'Hire Your Research Agent', time: '2:30 - 5:30', type: 'session' },
      { id: 12, img: '/Carnival/BOT-TALKS.webp', title: 'Bot Talks', time: '3:30 - 5:30', type: 'session' },
      { id: 104, img: '/Carnival/general/closing.webp', title: 'Closing Ceremony', time: '5:30 - 6:30', type: 'special' }
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
