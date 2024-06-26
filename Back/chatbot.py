import math
from common import client, makeup_response
from characters import characters

class Chatbot:

    def __init__(self, character_name, system_role, instruction):
        self.context = [{"role": "system", "content": system_role}]
        self.model = "gpt-4o"  # 모델명을 명시하거나 필요에 따라 수정 가능
        self.instruction = instruction
        self.system_role = system_role
        self.max_token_size = 16 * 1024
        self.available_token_rate = 0.9

    def add_user_message(self, user_message):
        self.context.append({"role": "user", "content": user_message})

    def _send_request(self):
        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=self.context,
                temperature=0.5,
                top_p=1,
                max_tokens=256,
                frequency_penalty=0,
                presence_penalty=0
            ).model_dump()
        except Exception as e:
            print(f"Exception 오류({type(e)}) 발생:{e}")
            if 'maximum context length' in str(e):
                self.context.pop()
                return makeup_response("메시지 조금 짧게 보내줄래?")
            else: 
                return makeup_response("[문제가 발생했습니다. 잠시 뒤 이용해주세요]")
            
        return response

    def send_request(self):
        self.context[-1]['content'] += f"\n{self.instruction}" 
        return self._send_request()

    def add_response(self, response):
        self.context.append({
                "role" : response['choices'][0]['message']["role"],
                "content" : response['choices'][0]['message']["content"],
            }
        )

    def get_response_content(self):
        return self.context[-1]['content']

    def clean_context(self):
        for idx in reversed(range(len(self.context))):
            if self.context[idx]["role"] == "user":
                self.context[idx]["content"] = self.context[idx]["content"].split("instruction:\n")[0].strip()
                break

    def handle_token_limit(self, response):
        try:
            current_usage_rate = response['usage']['total_tokens'] / self.max_token_size
            exceeded_token_rate = current_usage_rate - self.available_token_rate
            if exceeded_token_rate > 0:
                remove_size = math.ceil(len(self.context) / 10)
                self.context = [self.context[0]] + self.context[remove_size+1:]
        except Exception as e:
            print(f"handle_token_limit exception:{e}")
