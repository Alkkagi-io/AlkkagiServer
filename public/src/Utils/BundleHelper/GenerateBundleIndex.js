import { readdirSync, writeFileSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

const parentDir = join(process.cwd(), 'AlkkagiShared');
const indexDir = join(process.cwd(), 'Alkkagishared/Utils/BundleHelper');
const excludeDirs = ['Utils', 'Output'];

function collectFiles(dir) {
    let results = [];
    
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);
        
        if (stats.isDirectory()) {
            if (excludeDirs.includes(entry)) 
                continue;
            results = results.concat(collectFiles(fullPath));
        } else if (stats.isFile() && extname(entry) === '.js') {
            results.push(fullPath);
        }
    }

    return results;
}

const files = collectFiles(parentDir);
let content = files
    .map(f => {
        const relPath = './' + relative(indexDir, f).replace(/\\/g, '/');
        return `export * from '${relPath}';`;
    })
    .join('\n');

writeFileSync(join(indexDir, 'BundleIndex.js'), content);
console.log('bundle index file succeed generated');