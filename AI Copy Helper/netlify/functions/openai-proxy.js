const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('=== Function Start ===');
  console.log('Method:', event.httpMethod);
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const USE_FALLBACK = process.env.USE_FALLBACK === 'true';
    
    console.log('Prompt received:', prompt ? 'Yes' : 'No');
    console.log('API Key exists:', OPENAI_API_KEY ? 'Yes' : 'No');
    console.log('Use fallback:', USE_FALLBACK);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No prompt provided' })
      };
    }

    // If fallback mode is enabled or no API key, use mock response
    if (USE_FALLBACK || !OPENAI_API_KEY) {
      console.log('Using fallback response...');
      
      // Extract keywords from prompt for personalized fallback
      const keywordMatch = prompt.match(/based on these brand keywords: ([^.]+)/);
      const keywords = keywordMatch ? keywordMatch[1].split(',').map(k => k.trim()) : ['professional', 'quality'];
      
      const fallbackResponse = generateFallbackCopy(keywords, prompt);
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ result: fallbackResponse })
      };
    }

    console.log('Making OpenAI request...');
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error response:', errorText);
      
      // If it's a quota error, fall back to mock response
      if (response.status === 429 || errorText.includes('quota')) {
        console.log('Quota exceeded, using fallback...');
        const keywordMatch = prompt.match(/based on these brand keywords: ([^.]+)/);
        const keywords = keywordMatch ? keywordMatch[1].split(',').map(k => k.trim()) : ['professional', 'quality'];
        const fallbackResponse = generateFallbackCopy(keywords, prompt);
        
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ result: fallbackResponse })
        };
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API failed', 
          status: response.status,
          details: errorText 
        })
      };
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'No content generated';
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ result })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message
      })
    };
  }
};

function generateFallbackCopy(keywords, prompt) {
  // Extract business type if available
  const businessMatch = prompt.match(/for a ([^,\s]+)/);
  const businessType = businessMatch ? businessMatch[1] : 'business';
  
  // Generate personalized copy based on keywords
  const primaryKeyword = keywords[0] || 'professional';
  const secondaryKeyword = keywords[1] || 'quality';
  
  const taglines = [
    `${primaryKeyword} solutions for your ${businessType}`,
    `Where ${primaryKeyword} meets ${secondaryKeyword}`,
    `${primaryKeyword}, ${secondaryKeyword}, delivered`,
    `Your ${primaryKeyword} ${businessType} partner`
  ];
  
  const aboutSections = [
    `Hi, I'm Sarah, and I specialize in creating ${primaryKeyword} solutions that reflect your ${secondaryKeyword} standards.`,
    `Hello! I'm Michael, dedicated to delivering ${primaryKeyword} and ${secondaryKeyword} service for your ${businessType} needs.`,
    `I'm Jessica, passionate about combining ${primaryKeyword} execution with ${secondaryKeyword} results.`
  ];
  
  const serviceDescriptions = [
    `You'll receive ${primaryKeyword} service tailored to your vision, ensuring every detail meets your ${secondaryKeyword} expectations.`,
    `You'll get ${primaryKeyword} solutions designed with ${secondaryKeyword} in mind, delivering results that exceed your expectations.`,
    `You'll experience ${primaryKeyword} service that prioritizes ${secondaryKeyword}, creating lasting value for your ${businessType}.`
  ];
  
  // Randomly select from options for variety
  const randomIndex = Math.floor(Math.random() * 3);
  
  return `TAGLINE: ${taglines[randomIndex]}
---
ABOUT: ${aboutSections[randomIndex]}
---
SERVICE: ${serviceDescriptions[randomIndex]}`;
}