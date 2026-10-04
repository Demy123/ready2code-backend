const fs = require('fs');
const pdfParse = require('pdf-parse');

const dataBuffer = fs.readFileSync('../DSA Problem Bank_1.pdf');
pdfParse(dataBuffer).then(data => {
  console.log('Total Pages:', data.numpages);
  console.log('Length of text:', data.text.length);
  console.log('--- PREVIEW (first 2500 chars) ---');
  console.log(data.text.substring(0, 2500));
  fs.writeFileSync('../parsed_pdf_text.txt', data.text);
  console.log('✅ Successfully extracted and wrote to parsed_pdf_text.txt');
}).catch(err => {
  console.error('Error parsing PDF:', err);
});
