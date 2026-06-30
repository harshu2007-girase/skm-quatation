const fs = require('fs');
const vm = require('vm');

const context = {
  Blob,
  TextDecoder,
  TextEncoder,
  URL,
  atob: value => Buffer.from(value, 'base64').toString('binary'),
  btoa: value => Buffer.from(value, 'binary').toString('base64'),
  clearTimeout,
  console,
  navigator: { userAgent: 'SKM PDF validation' },
  setTimeout,
};
context.window = context;
context.self = context;
context.globalThis = context;
vm.createContext(context);

for (const filename of [
  'public/vendor/jspdf.umd.min.js',
  'public/vendor/jspdf.plugin.autotable.min.js',
  'public/vendor/pdf-assets.js',
]) {
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
}

const assets = context.SKM_PDF_ASSETS;
if (!assets?.logo?.data || !assets?.stamp?.data || !assets?.['public/assets/nexon-1kg-new.jpg']?.data) {
  throw new Error('Required embedded PDF assets are missing');
}

const { jsPDF } = context.jspdf;
const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
doc.addImage(assets.logo.data, assets.logo.format, 10, 10, 30, 30, undefined, 'FAST');
doc.addImage(assets.stamp.data, assets.stamp.format, 160, 10, 27, 27, undefined, 'FAST');
doc.autoTable({
  startY: 50,
  head: [['Item', 'Quantity', 'Amount']],
  body: [['NEXON 1KG Economic', '1', '28,000.00']],
});
doc.addPage();
const brochure = assets['public/assets/nexon-1kg-new.jpg'];
doc.addImage(brochure.data, brochure.format, 35, 15, 140, 198, undefined, 'FAST');

const bytes = Buffer.from(doc.output('arraybuffer'));
if (bytes.length < 100000 || bytes.subarray(0, 4).toString() !== '%PDF') {
  throw new Error('Generated PDF is invalid or unexpectedly empty');
}
fs.writeFileSync('/tmp/skm-download-test.pdf', bytes);
console.log(`PASS: generated ${bytes.length} byte PDF with embedded artwork`);
