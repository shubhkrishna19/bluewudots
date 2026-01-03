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
        this.ignoreDirs = ['node_modules', 'dist', 'build', 'assets', '.git', '__tests__'];
        this.summaryOutputPath = './codebase_summary.json';
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
            if (trimmed.includes('function') || trimmed.includes('=>') || trimmed.startsWith('class ') || (trimmed.startsWith('export const') && trimmed.includes('='))) {
                if (!inJSDoc && trimmed.length > 5 && !trimmed.startsWith('import ') && !trimmed.startsWith('console.')) {
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
     * Extracts a high-level summary of the file (e.g., first few lines of comments).
     */
    extractFileSummary(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const match = content.match(/\/\*\*([\s\S]*?)\*\//);
        return match ? match[1].replace(/\*/g, '').trim() : 'No summary available.';
    }

    /**
     * Generates the context_index.md file.
     */
    generateIndex() {
        console.log(`[Context] Indexing ${this.srcPath}...`);
        const files = this.findFiles(this.srcPath);
        let markdown = `# Bluewud OTS: Global Context Index\n\nGenerated on ${new Date().toISOString()}\n\n`;
        const summaryData = {};

        files.forEach(file => {
            const signatures = this.extractSignatures(file);
            const relativePath = path.relative(process.cwd(), file);
            const fileSummary = this.extractFileSummary(file);

            summaryData[relativePath] = {
                summary: fileSummary,
                functions: signatures.map(s => s.signature)
            };

            if (signatures.length > 0) {
                markdown += `## [${path.basename(file)}](file://${path.resolve(file)})\n`;
                markdown += `> ${fileSummary}\n\n`;
                signatures.forEach(sig => {
                    markdown += "```javascript\n";
                    if (sig.jsdoc) markdown += `${sig.jsdoc}\n`;
                    markdown += `${sig.signature}\n`;
                    markdown += "```\n\n";
                });
            }
        });

        fs.writeFileSync(this.outputPath, markdown);
        fs.writeFileSync(this.summaryOutputPath, JSON.stringify(summaryData, null, 2));
        console.log(`[Context] Index generated at ${this.outputPath}`);
        console.log(`[Context] JSON summary generated at ${this.summaryOutputPath}`);
    }
}

const injector = new ContextInjection();
injector.generateIndex();

export default injector;
