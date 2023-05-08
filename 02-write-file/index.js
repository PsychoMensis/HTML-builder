const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = './02-write-file/text.txt';
fs.writeFile(filePath, '', (err) => {
    if (err) throw err;
    console.log('Hello, please enter some text:');
});

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    fs.appendFile(filePath, input + '\n', (err) => {
      if (err) throw err;
      console.log(`"${input}" was added to ${filePath}`);
      console.log('Please enter more text, or type "exit" to quit:');
    });
  }
});

rl.on('close', () => {
  console.log('Goodbye!');
});
