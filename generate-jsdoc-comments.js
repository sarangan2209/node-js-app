require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateJsDoc(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(` File not found: ${filePath}`);
    return;
  }

  const code = fs.readFileSync(filePath, 'utf-8');
  const prompt = `Add JSDoc comments to the following JavaScript code:\n\n${code}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  const updatedCode = response.choices[0].message.content;
  fs.writeFileSync(filePath, updatedCode, 'utf-8');
  console.log(` JSDoc added to: ${filePath}`);
}

async function processPath(targetPath) {
  const stat = fs.statSync(targetPath);

  if (stat.isFile() && targetPath.endsWith('.js')) {
    await generateJsDoc(targetPath);
  } else if (stat.isDirectory()) {
    const entries = fs.readdirSync(targetPath);
    for (const entry of entries) {
      const fullPath = path.join(targetPath, entry);
      const entryStat = fs.statSync(fullPath);
      if (entryStat.isFile() && fullPath.endsWith('.js')) {
        await generateJsDoc(fullPath);
      }
    }
  } else {
    console.warn(`⚠️ Skipping unsupported path: ${targetPath}`);
  }
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Please provide a file or directory");
  process.exit(1);
}

processPath(inputPath);
