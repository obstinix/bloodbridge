import os
import logging
from flask import Blueprint, request, jsonify, current_app
from blood_bank_app.extensions import limiter

# Setup logging
logger = logging.getLogger(__name__)

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/v1/chatbot')

# Offline medical responder dictionary for instant realistic Q&A fallback
OFFLINE_RESPONSES = [
    {
        'keywords': ['compatib', 'group', 'type', 'receive', 'universal'],
        'response': (
            "🩸 **Blood Group Compatibility Matrix:**\n\n"
            "- **O Negative (O-)**: The Universal Donor. Can donate to all blood groups, but can only receive from O-.\n"
            "- **AB Positive (AB+)**: The Universal Recipient. Can receive from all blood groups, but can only donate to AB+.\n"
            "- **A+ / A-**: A- can receive from O-, A-. A+ can receive from A+, A-, O+, O-.\n"
            "- **B+ / B-**: B- can receive from O-, B-. B+ can receive from B+, B-, O+, O-.\n"
            "Always match recipient groups carefully during blood bank operations."
        )
    },
    {
        'keywords': ['healthy', 'criteria', 'eligib', 'who can', 'age', 'weight'],
        'response': (
            "📋 **Donor Eligibility Guidelines:**\n\n"
            "To donate blood safely, donors must meet the following criteria:\n"
            "1. **Age**: Must be between 18 and 65 years old.\n"
            "2. **Weight**: Must weigh at least 50 kg (110 lbs).\n"
            "3. **Health**: Feeling fully healthy and active on the day of donation.\n"
            "4. **Interval**: At least 8-12 weeks must pass between successive whole blood donations.\n"
            "5. **Exclusions**: No active infections, low hemoglobin level (<12.5 g/dL), or high-risk medical histories."
        )
    },
    {
        'keywords': ['benefits', 'why donate', 'help', 'save lives'],
        'response': (
            "💖 **Why Donate Blood?**\n\n"
            "- **Save Lives**: A single blood donation can save up to **three lives**! Blood is split into red cells, plasma, and platelets.\n"
            "- **Cardiovascular Health**: Regular donation helps reduce blood viscosity and maintains healthy iron levels, lowering heart disease risk.\n"
            "- **Free Health Check**: Donors receive a quick physical exam covering blood pressure, pulse, temperature, and hemoglobin levels."
        )
    },
    {
        'keywords': ['process', 'how to', 'appointment', 'what happens'],
        'response': (
            "🏥 **The Donation Process Step-by-Step:**\n\n"
            "1. **Registration**: Quick check-in of personal and contact details.\n"
            "2. **Health Screening**: A brief, private review of health history and vitals (vitals check).\n"
            "3. **Donation**: The actual extraction takes about 8-10 minutes. A sterile needle is used to draw 350-450 ml of whole blood.\n"
            "4. **Recovery**: Relax for 10-15 minutes with a light snack and drink to restore fluid levels."
        )
    }
]

DEFAULT_FALLBACK = (
    "🤖 **BloodBridge Health Assistant:**\n\n"
    "Hello! I am your AI Health Assistant. I can help answer questions regarding:\n"
    "- Blood group compatibility matrix & receiving capabilities.\n"
    "- Donor eligibility guidelines (age, health criteria, weight).\n"
    "- Core health benefits of active blood donation.\n"
    "- The step-by-step donation process.\n\n"
    "Could you clarify your question, or ask about any of these health topics?"
)

@chatbot_bp.route('', methods=['POST'])
@limiter.limit("30 per minute")
def ask_chatbot():
    try:
        data = request.get_json() or {}
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'success': False, 'message': 'Query is required'}), 400
            
        # Check for Gemini API key
        api_key = os.getenv('GEMINI_API_KEY')
        
        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                
                # Use Gemini 1.5 Flash for high performance and response speed
                model = genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    system_instruction=(
                        "You are the BloodBridge Healthcare AI Chatbot. You must provide clear, concise, "
                        "professional, and medically accurate answers about blood donation, donor eligibility, "
                        "blood groups, compatibility, and recovery. Always keep responses formatted nicely in markdown."
                    )
                )
                response = model.generate_content(query)
                return jsonify({
                    'success': True,
                    'response': response.text,
                    'mode': 'gemini-ai'
                })
            except Exception as gemini_err:
                logger.error(f"Gemini API execution failed: {gemini_err}")
                # Fall through to offline response engine on failure
                
        # Check for Claude API key as alternative
        claude_key = os.getenv('ANTHROPIC_API_KEY')
        if claude_key:
            try:
                import urllib.request
                import json
                
                url = "https://api.anthropic.com/v1/messages"
                headers = {
                    "x-api-key": claude_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                }
                payload = {
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 1000,
                    "system": "You are the BloodBridge Healthcare AI Chatbot. Provide professional, medically accurate advice about blood group compatibility and donation criteria. Maintain markdown formatting.",
                    "messages": [{"role": "user", "content": query}]
                }
                
                req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
                with urllib.request.urlopen(req) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    response_text = resp_data['content'][0]['text']
                    return jsonify({
                        'success': True,
                        'response': response_text,
                        'mode': 'claude-ai'
                    })
            except Exception as claude_err:
                logger.error(f"Claude API execution failed: {claude_err}")
                # Fall through to offline
                
        # --- OFFLINE MATCHING ENGINE ---
        query_lower = query.lower()
        for responder in OFFLINE_RESPONSES:
            if any(k in query_lower for k in responder['keywords']):
                return jsonify({
                    'success': True,
                    'response': responder['response'],
                    'mode': 'offline-expert'
                })
                
        return jsonify({
            'success': True,
            'response': DEFAULT_FALLBACK,
            'mode': 'offline-fallback'
        })
        
    except Exception as e:
        logger.error(f"Chatbot endpoint error: {e}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500
