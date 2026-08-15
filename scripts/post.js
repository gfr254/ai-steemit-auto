import fs from 'fs';
import path from 'path';
import dsteem from 'dsteem';

const client = new dsteem.Client('https://api.steemit.com');
const privateKey = dsteem.PrivateKey.fromString(process.env.STEEM_POST_KEY);

async function main() {
  const author = process.env.STEEM_USERNAME;

  const postsDir = path.join('posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const latest = files.sort().reverse()[0];
  const body = fs.readFileSync(path.join(postsDir, latest), 'utf8');

  const title = body.split('\n')[0].replace('# ', '').trim();
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
  console.log(`Steemit投稿完了: ${latest}`);
}

main();
