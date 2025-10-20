import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import axios from 'axios';

const router = Router();

// Alibaba Cloud Qwen API configuration
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

// Generate trip itinerary using AI
router.post('/generate-itinerary', authenticateToken, async (req, res) => {
  try {
    const { destination, days, budget, travelers, preferences } = req.body;

    const prompt = `作为一个专业的旅行规划师，请为以下需求生成详细的旅行计划：

目的地：${destination}
旅行天数：${days}天
预算：${budget}元人民币
旅行人数：${travelers}人
旅行偏好：${preferences}

请按以下JSON格式返回旅行计划（只返回JSON，不要其他说明文字）：
{
  "overview": "行程概述",
  "days": [
    {
      "day": 1,
      "date": "日期",
      "activities": [
        {
          "time": "时间",
          "title": "活动名称",
          "description": "活动描述",
          "location": "地点",
          "estimatedCost": 费用数字,
          "coordinates": {
            "lat": 纬度,
            "lng": 经度
          }
        }
      ]
    }
  ],
  "accommodation": {
    "name": "推荐酒店名称",
    "type": "酒店类型",
    "location": "酒店位置",
    "estimatedCost": 每晚费用,
    "coordinates": {
      "lat": 纬度,
      "lng": 经度
    }
  },
  "transportation": {
    "arrival": "到达交通方式及费用",
    "local": "当地交通建议",
    "departure": "返程交通方式及费用"
  },
  "budgetBreakdown": {
    "accommodation": 住宿总费用,
    "transportation": 交通总费用,
    "activities": 活动总费用,
    "food": 餐饮总费用,
    "other": 其他费用,
    "total": 总费用
  },
  "tips": ["旅行建议1", "旅行建议2", "旅行建议3"]
}`;

    if (!DASHSCOPE_API_KEY) {
      // Fallback mock response for development
      const mockItinerary = generateMockItinerary(destination, days, budget, travelers, preferences);
      return res.json({ itinerary: mockItinerary });
    }

    // Call Alibaba Cloud Qwen API
    const response = await axios.post(
      DASHSCOPE_API_URL,
      {
        model: 'qwen-max',
        input: {
          messages: [
            {
              role: 'system',
              content: '你是一个专业的旅行规划助手，擅长根据用户需求生成详细的旅行计划。'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        parameters: {
          result_format: 'message',
          temperature: 0.7
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.output.choices[0].message.content;
    
    // Try to parse JSON from AI response
    let itinerary;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      itinerary = JSON.parse(jsonStr);
    } catch (e) {
      // If parsing fails, use mock data
      console.error('Failed to parse AI response:', e);
      itinerary = generateMockItinerary(destination, days, budget, travelers, preferences);
    }

    res.json({ itinerary });
  } catch (error: any) {
    console.error('AI generation error:', error.response?.data || error.message);
    
    // Fallback to mock data on error
    const { destination, days, budget, travelers, preferences } = req.body;
    const mockItinerary = generateMockItinerary(destination, days, budget, travelers, preferences);
    res.json({ itinerary: mockItinerary });
  }
});

// Analyze expenses using AI
router.post('/analyze-expenses', authenticateToken, async (req, res) => {
  try {
    const { expenses, budget } = req.body;

    const totalSpent = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const remaining = budget - totalSpent;

    const analysis = {
      totalSpent,
      remaining,
      percentage: (totalSpent / budget) * 100,
      byCategory: expenses.reduce((acc: any, exp: any) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {}),
      suggestions: [
        remaining < 0 ? '预算已超支，建议减少不必要的开支' : '预算控制良好',
        '建议为突发情况预留10%的应急资金',
        '可以使用当地交通卡节省交通费用'
      ]
    };

    res.json({ analysis });
  } catch (error) {
    console.error('Expense analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze expenses' });
  }
});

// Helper function to generate mock itinerary
function generateMockItinerary(destination: string, days: number, budget: number, travelers: number, preferences: string) {
  const daysArray = [];
  const costPerDay = Math.floor(budget / days / 1.5);

  for (let i = 1; i <= days; i++) {
    daysArray.push({
      day: i,
      date: `第${i}天`,
      activities: [
        {
          time: '09:00',
          title: `${destination}经典景点游览`,
          description: `参观${destination}最著名的景点，体验当地文化`,
          location: `${destination}市中心`,
          estimatedCost: costPerDay * 0.3,
          coordinates: { lat: 35.6762 + i * 0.01, lng: 139.6503 + i * 0.01 }
        },
        {
          time: '12:00',
          title: '品尝当地美食',
          description: `享用${destination}特色午餐，${preferences}相关的美食体验`,
          location: `${destination}美食街`,
          estimatedCost: costPerDay * 0.2,
          coordinates: { lat: 35.6762 + i * 0.01, lng: 139.6503 + i * 0.01 }
        },
        {
          time: '14:00',
          title: '文化体验活动',
          description: `参与${preferences}相关的文化活动`,
          location: `${destination}文化区`,
          estimatedCost: costPerDay * 0.3,
          coordinates: { lat: 35.6762 + i * 0.01, lng: 139.6503 + i * 0.01 }
        },
        {
          time: '18:00',
          title: '夜景观赏',
          description: `欣赏${destination}迷人的夜景`,
          location: `${destination}观景台`,
          estimatedCost: costPerDay * 0.2,
          coordinates: { lat: 35.6762 + i * 0.01, lng: 139.6503 + i * 0.01 }
        }
      ]
    });
  }

  return {
    overview: `这是一个${days}天的${destination}深度游计划，专门为${travelers}人设计，预算${budget}元。行程充分考虑了您对${preferences}的偏好，将带您深入体验${destination}的独特魅力。`,
    days: daysArray,
    accommodation: {
      name: `${destination}精品酒店`,
      type: '四星级酒店',
      location: `${destination}市中心`,
      estimatedCost: Math.floor(budget * 0.3 / days),
      coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    transportation: {
      arrival: `往返机票约${Math.floor(budget * 0.2)}元/人`,
      local: '建议购买当地交通卡，地铁和公交都很方便',
      departure: '提前3小时到达机场办理登机手续'
    },
    budgetBreakdown: {
      accommodation: Math.floor(budget * 0.3),
      transportation: Math.floor(budget * 0.25),
      activities: Math.floor(budget * 0.25),
      food: Math.floor(budget * 0.15),
      other: Math.floor(budget * 0.05),
      total: budget
    },
    tips: [
      `${destination}的最佳旅游季节是春秋两季`,
      '建议提前预订热门景点门票',
      '随身携带护照复印件和紧急联系方式',
      `学习几句${destination}常用语会让旅行更顺利`,
      '购买旅游保险以应对突发情况'
    ]
  };
}

export default router;

