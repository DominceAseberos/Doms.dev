const https = require('https');
https.get('https://scrapingant.com/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = data.match(/<svg[^>]*>.*?<\/svg>/gs);
        if (matches) {
            matches.forEach((svg, i) => {
                if(svg.length < 5000 && svg.includes('ant') || svg.includes('logo') || i < 10) {
                    console.log(`\n\n--- SVG ${i} ---`);
                    console.log(svg.substring(0, 500));
                }
            });
        }
    });
});
