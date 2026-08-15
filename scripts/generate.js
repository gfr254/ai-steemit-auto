import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const file = path.join('posts', `${today}.md`);

  const prompt = `
Steemit向けの記事を生成してください。
テーマ：AIと自動化の未来
構成：タイトル＋本文（800〜1200文字）
文体：読みやすく、体験談を交える
`;

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  fs.writeFileSync(file, completion.output_text);
  console.log("AI記事生成完了:", file);
}

main();
