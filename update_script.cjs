const fs = require('fs');
const path = require('path');

const projects = ['peak', 'Velocity', 'fashion', 'github-universe', 'Catsy-Final/catsy-web', 'GanapPH', 'kernel', 'vayora', 'Banana-Leaf-Detector/templates', 'live-pixvault', 'deep-dive'];

projects.forEach(project => {
    let p = `/mnt/datadrive/Project/${project}/index.html`;
    if (!fs.existsSync(p)) {
        console.log(`Missing: ${p}`);
        return;
    }
    let content = fs.readFileSync(p, 'utf-8');
    
    // Replace window.location.pathname with history.pushState
    content = content.replace(
        "window.location.pathname = e.data.payload.url;",
        "history.pushState(null, '', e.data.payload.url);\n          window.dispatchEvent(new PopStateEvent('popstate'));"
    );
    
    fs.writeFileSync(p, content);
    console.log(`Updated: ${p}`);
});
