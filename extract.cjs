const fs = require('fs');
const content = fs.readFileSync('src/features/About/components/ui/ContactSquiggles.jsx', 'utf8');

const match1 = content.match(/<svg className="ns-squiggle ns-squiggle-1".*?<\/svg>/s);
if (match1) {
    let svg = match1[0].replace(/className="ns-squiggle ns-squiggle-1" ref=\{svg1Ref\} style=\{[^}]+\} /, '');
    svg = svg.replace(/fill="currentColor"/, 'fill="black"');
    fs.writeFileSync('src/assets/svg/contact-squiggle-1.svg', svg);
}

const match2 = content.match(/<svg className="ns-squiggle ns-squiggle-2".*?<\/svg>/s);
if (match2) {
    let svg = match2[0].replace(/className="ns-squiggle ns-squiggle-2" ref=\{svg2Ref\} style=\{[^}]+\} /, '');
    svg = svg.replace(/fill="currentColor"/, 'fill="black"');
    fs.writeFileSync('src/assets/svg/contact-squiggle-2.svg', svg);
}
