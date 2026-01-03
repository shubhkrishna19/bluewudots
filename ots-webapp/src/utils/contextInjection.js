/**
 * Context Injection Utility
 * Scans the src directory to extract function signatures and JSDoc for indexing.
 */

import fs from 'fs';
import path from 'path';

class ContextInjection {
    constructor(srcPath = './ots-webapp/src') {
        this.srcPath = srcPath;
        this.outputPath = './context_index.md';
        this.ignoreDirs = ['node_modules', 'dist', 'build', 'assets'];
    }

    /**
     * Recursively find all JS/JSX files.
     */
    findFiles(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                if (!this.ignoreDirs.includes(file)) {
                    this.findFiles(filePath, fileList);
                }
            } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
                fileList.push(filePath);
            }
        });
        return fileList;
    }

    /**
     * Extracts function signatures and JSDoc.
     */
    extractSignatures(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const results = [];
        let currentJSDoc = [];
        let inJSDoc = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('/**')) inJSDoc = true;
            if (inJSDoc) currentJSDoc.push(trimmed);
            if (trimmed.endsWith('*/')) inJSDoc = false;

            // Simple regex for function signatures (classes, const functions, traditional functions)
            if (trimmed.includes('function') || trimmed.includes('=>') || trimmed.startsWith('class ')) {
                if (!inJSDoc && trimmed.length > 5) {
                    results.push({
                        jsdoc: currentJSDoc.join('\n'),
                        signature: trimmed
                    });
                    currentJSDoc = [];
                }
            }
        });

        return results;
    }

    /**
     * Generates the context_index.md file.
     */
    generateIndex() {
        console.log(`[Context] Indexing ${this.srcPath}...`);
        const files = this.findFiles(this.srcPath);
        let markdown = `# Bluewud OTS: Global Context Index\n\nGenerated on ${new Date().toISOString()}\n\n`;

        files.forEach(file => {
            const signatures = this.extractSignatures(file);
            if (signatures.length > 0) {
                markdown += `## [${path.basename(file)}](file://${path.resolve(file)})\n\n`;
                signatures.forEach(sig => {
                    markdown += "```javascript\n";
                    if (sig.jsdoc) markdown += `${sig.jsdoc}\n`;
                    markdown += `${sig.signature}\n`;
                    markdown += "```\n\n";
                });
            }
        });

        fs.writeFileSync(this.outputPath, markdown);
        console.log(`[Context] Index generated at ${this.outputPath}`);
    }
}

const injector = new ContextInjection();
injector.generateIndex();

export default injector;
