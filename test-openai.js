


async function testOpenAI() {
    try {
      // .env.local 파일에서 API 키 읽기
      const fs = require('fs');
      const envContent = fs.readFileSync('.env.local', 'utf8');
      console.log('.env.local 내용:');
      console.log(envContent);
      
      // OPENAI_API_KEY 추출
      const match = envContent.match(/OPENAI_API_KEY=(.+)/);
      if (!match) {
        console.error('❌ OPENAI_API_KEY를 찾을 수 없습니다!');
        return;
      }
      
      const apiKey = match[1].trim();
      console.log('✅ API 키 발견:', apiKey.substring(0, 20) + '...');
      
      // OpenAI API 테스트
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: '안녕하세요!'
            }
          ],
          max_tokens: 50,
        }),
      });
  
      console.log('API 응답 상태:', response.status, response.statusText);
  
      if (response.ok) {
        const data = await response.json();
        console.log('✅ OpenAI API 테스트 성공!');
        console.log('응답:', data.choices[0]?.message?.content);
      } else {
        const error = await response.text();
        console.error('❌ OpenAI API 오류:', error);
      }
      
    } catch (error) {
      console.error('❌ 테스트 실행 오류:', error);
    }
  }
  
  testOpenAI(); 