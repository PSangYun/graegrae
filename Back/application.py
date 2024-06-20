from flask import Flask, request, jsonify
from flask_cors import CORS
from common import model
from chatbot import Chatbot
from characters import characters  # characters 모듈 가져오기

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('./serviceAccountKey.json')
firebase_admin.initialize_app(cred,{
    'databaseURL' : 'https://test-oss-3aafa-default-rtdb.firebaseio.com/'
})

application = Flask(__name__)
CORS(application)  # CORS 설정

@application.route('/chat-api', methods=['POST'])
def chat_api():
    request_data = request.json
    request_message = request_data['request_message']
    character_name = request_data['character_name']
    who=request_data['who']

    print("who:", who)
    print("request_message:", request_message)
    print("character_name:", character_name)

    ref=db.reference('Chat')
    messages=ref.child(character_name).child(who).get()

    sorted_messages = sorted(messages.items(), key=lambda x: x[1].get('timestamp', 0), reverse=True)
    latest_messages = sorted_messages[-20:]  

    # for key, value in messages.items():
    #     print(f"{value['sender']}: {value['message']}")

    # 요청된 캐릭터 이름에 맞는 Chatbot 인스턴스 생성
    if character_name not in characters:
        return jsonify({"error": f"Character '{character_name}' not found"}), 400

    character = characters[character_name]  # 캐릭터 인스턴스 가져오기
    system_role = character.system_role
    instruction = character.instruction

    chatbot = Chatbot(character_name, system_role, instruction)  # 인자를 모두 전달

    # for key, value in messages.items():
    for key, value in latest_messages:
        sender=value['sender']
        message=value['message']
        print(message)
        if sender == 'user':
            chatbot.add_user_message(message)
        else:
            chatbot.add_response({
                "choices": [
                    {
                        "message": {
                            "role": "assistant",
                            "content": message
                        }
                    }
                ]
            })

    chatbot.add_user_message(request_message)
    response = chatbot.send_request()
    chatbot.add_response(response)
    response_message = chatbot.get_response_content()
    chatbot.handle_token_limit(response)
    chatbot.clean_context()
    print("response_message:", response_message)
    
    return jsonify({"response_message": response_message})

if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True)
