// AgriSpike AI Support Service
// Intelligent agronomy conversational engine grounded in live AgriSpike field telemetry.
// Supports intent parsing, field context injection, and human team escalation.

import { sensorDataService } from './sensorDataService';
import { TEAM_MEMBERS, SUPPORT_CONFIG } from '../constants/agriConfig';

export class AiSupportService {
  constructor() {
    this.supportTickets = [];
  }

  // Analyzes user query against live field telemetry
  async processQuery(userMessage, activeNodeId = 1) {
    const text = userMessage.toLowerCase().trim();
    const state = sensorDataService.getState();
    const readings = state.readings;
    const node = state.nodes.find(n => n.id === Number(activeNodeId)) || state.nodes[0];
    const r = readings[node.id];

    // Simulated network/processing latency for realistic interaction
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check for human assistance / hardware fault / emergency escalation keywords
    const escalationKeywords = [
      'human', 'team', 'contact', 'call', 'talk to person', 'agent',
      'broken', 'burned', 'burnt', 'damaged', 'fire', 'leak',
      'hardware failure', 'not working', 'offline', 'help me urgent', 'repair'
    ];

    const needsEscalation = escalationKeywords.some(kw => text.includes(kw)) || (r && r.err);

    if (needsEscalation) {
      // Determine relevant team specialist based on context
      let assignedMember = TEAM_MEMBERS[0]; // Sanjay by default
      if (text.includes('firmware') || text.includes('code') || text.includes('lora')) {
        assignedMember = TEAM_MEMBERS.find(m => m.name.includes('KIRUBAASREE')) || assignedMember;
      } else if (text.includes('hardware') || text.includes('sensor') || text.includes('wiring')) {
        assignedMember = TEAM_MEMBERS.find(m => m.name.includes('THANISKA')) || assignedMember;
      } else if (text.includes('backend') || text.includes('server') || text.includes('database')) {
        assignedMember = TEAM_MEMBERS.find(m => m.name.includes('SWATHI')) || assignedMember;
      }

      const ticket = {
        id: `TKT-${Date.now().toString().slice(-4)}`,
        query: userMessage,
        nodeId: node.id,
        nodeName: node.name,
        assignedTo: assignedMember.name,
        assignedPhone: assignedMember.phone,
        status: 'Logged & Dispatched',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.supportTickets.push(ticket);

      return {
        escalated: true,
        ticket,
        text: `This issue may require assistance from the AgriSpike team. Your support request has been forwarded to the team.\n\nTicket #${ticket.id} has been routed to ${assignedMember.name} (${assignedMember.role}, Helpline: ${assignedMember.phone}). You may also reach AgriSpike general support at ${SUPPORT_CONFIG.phone}.`,
      };
    }

    // Contextual agricultural answers grounded in live sensor data:

    // 1. Soil Moisture & Irrigation Queries
    if (text.includes('moisture') || text.includes('irrigation') || text.includes('water') || text.includes('dry')) {
      if (!r || r.err) {
        return {
          text: `Based on your field data, sensor telemetry for ${node.name} is currently offline. Please inspect physical sensor connections or choose another active node on the Irrigation page.`,
        };
      }

      if (r.sm < 35) {
        return {
          text: `Based on your field data for ${node.name}, your soil moisture is currently low (${r.sm}%). Irrigation is strongly recommended for this zone. Please check the Smart Irrigation page and activate irrigation if required.`,
        };
      } else if (r.sm > 70) {
        return {
          text: `Based on your field data for ${node.name}, soil moisture is high (${r.sm}%). Irrigation is currently not recommended to prevent waterlogging and nutrient leaching.`,
        };
      } else {
        return {
          text: `Based on your field data for ${node.name}, soil moisture is within the healthy optimal range (${r.sm}%). No immediate irrigation is required right now.`,
        };
      }
    }

    // 2. Plant Stress Queries
    if (text.includes('stress') || text.includes('wilt') || text.includes('dying') || text.includes('yellowing')) {
      if (!r || r.err) {
        return {
          text: `I don't currently have access to the required sensor data for ${node.name}. Please check the selected node.`,
        };
      }

      if (r.psi > 50) {
        return {
          text: `Based on your field data for ${node.name}, the Plant Stress Index is elevated (${r.psi}/100) with air temperature at ${r.at}°C and soil moisture at ${r.sm}%. Plant stress may be related to soil moisture deficit or high ambient heat. I recommend checking the affected sensor node and reviewing the irrigation and fertilizer suggestions.`,
        };
      } else {
        return {
          text: `Based on your field data for ${node.name}, the Plant Stress Index is comfortably low (${r.psi}/100). The crops appear healthy under current atmospheric and soil conditions.`,
        };
      }
    }

    // 3. Fertilizer Queries
    if (text.includes('fertilizer') || text.includes('nutrient') || text.includes('npk') || text.includes('urea') || text.includes('potash')) {
      const rec = sensorDataService.getFertilizerRecommendation(node.id);
      return {
        text: `Based on your field data for ${node.name}:\n\n• Recommended: ${rec.fertilizer}\n• Reason: ${rec.reason}\n\nYou can view purchasing options directly in the Fertilizer Shop section.`,
      };
    }

    // 4. Crop Suggestion Queries
    if (text.includes('crop') || text.includes('grow') || text.includes('plant') || text.includes('yield') || text.includes('turmeric') || text.includes('paddy')) {
      const crops = sensorDataService.getCropSuitability(node.id);
      const highFit = crops.filter(c => c.suitability === 'High').map(c => c.name).join(', ');
      return {
        text: `Based on your field data for ${node.name} (Soil Temp: ${r ? r.st : '--'}°C, Moisture: ${r ? r.sm : '--'}%):\n\nCrops with High Suitability: ${highFit || 'Millets / Dryland Crops'}.\nVisit the Crop Suggestion page for a detailed suitability breakdown across all 4 zones.`,
      };
    }

    // 5. Disease Queries
    if (text.includes('disease') || text.includes('rot') || text.includes('blight') || text.includes('fungus') || text.includes('pest')) {
      return {
        text: `AgriSpike includes a comprehensive disease diagnosis catalog for Turmeric (Rhizome Rot, Leaf Blotch), Paddy (Blast, Bacterial Blight), Banana (Panama Wilt), and Groundnut (Leaf Spot). Please open the Disease Identification page to view diagnostic symptoms, preventive measures, and recommended treatments.`,
      };
    }

    // 6. General AgriSpike Info / Help
    return {
      text: `Based on your field data, AgriSpike is actively monitoring 4 LoRa IoT zones across your 11.4939°N, 77.2705°E farm. You can ask me about soil moisture, heat stress, irrigation status, fertilizer recommendations, or specific crop advice. For urgent issues, you can also request human assistance.`,
    };
  }

  getTickets() {
    return [...this.supportTickets];
  }
}

export const aiSupportService = new AiSupportService();
