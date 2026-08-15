import fs from 'fs';
import path from 'path';
import dsteem from 'dsteem';

const client = new dsteem.Client('https://api.steemit.com');
const privateKey = dsteem.PrivateKey.fromString(process.env.STEEM_POST_KEY);

async function main() {
  const author = process.env.STEEM_USERNAME;

  const postsDir = path.join('posts');

  if (!fs.existsSync(postsDir)) {
    throw new Error(`posts/ フォルダが存在しません: ${postsDir}`);
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    throw new Error(`posts/ に .md ファイルがありません`);
  }

  const latest = files.sort().reverse()[0];
  const filePath = path.join(postsDir, latest);
  const body = fs.readFileSync(filePath, 'utf8').trim();

  if (!body || body.length === 0) {
    throw new Error(`最新の Markdown が空です: ${filePath}`);
  }

  let title = body.split('\n')[0].replace('# ', '').trim();
  if (!title) title = "AI Auto Generated Post";

  const permlink = 'ai-' + Date.now();

  const jsonMetadata = {
    tags: ['ai', 'automation', 'github'],
    app: 'ai-steemit-auto'
  };

  const op = [
    'comment',
    {
      parent_author: '',
      parent_permlink: 'blog',
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata)
    }
  ];

  await client.broadcast.sendOperations([op], privateKey);
  console.log(`✔ Steemit投稿完了: ${latest}`);
}

main();
