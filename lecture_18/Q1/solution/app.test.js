const fs = require('fs');
const path = require('path');
const grunt = require('grunt');
const exec = require('child_process').exec;

describe('Grunt Configuration', () => {
    beforeAll((done) => {
        // Path to the directory containing the files you want to remove
        const minifiedPath = 'public/minified';

        // Remove all files in the directory
        fs.readdirSync(minifiedPath).forEach((file) => {
            const filePath = path.join(minifiedPath, file);
            fs.unlinkSync(filePath);
        });

        console.log(`Removed all files in ${minifiedPath}`);

        exec('grunt default', (error, stdout, stderr) => {
            if (error) {
                console.error(`Grunt execution error: ${error}`);
                return done(error);
            }
            console.log(`Grunt output: ${stdout}`);
            done();
        });
    });

    it('should have minified CSS and JS files', () => {
        const minifiedDir = 'public/minified';
        const files = fs.readdirSync(minifiedDir);
    
        // Filter for files with .css and .js extensions
        const cssFiles = files.filter((file) => path.extname(file) === '.css');
        const jsFiles = files.filter((file) => path.extname(file) === '.js');
    
        // Check if at least one .css and one .js file exist
        expect(cssFiles.length > 0).toBe(true);
        expect(jsFiles.length > 0).toBe(true);
    });
    
});
