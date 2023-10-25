const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Grunt Configuration', () => {
  beforeAll((done) => {
    // Store the original content of index.html
    const indexHtmlPath = path.join(__dirname, 'src', 'index.html');
    const originalContent = fs.readFileSync(indexHtmlPath, 'utf8');

    // Modify index.html content for testing
    fs.writeFileSync(indexHtmlPath, 'This is a test: foo');

    // Execute the Grunt task
    exec('npx grunt default', (error, stdout, stderr) => {
      if (error) {
        console.error(`Grunt execution error: ${error}`);
        done(error);
        return;
      }

      // Restore the original content of index.html
      fs.writeFileSync(indexHtmlPath, originalContent);

      done();
    });
  });

  it('should replace "foo" with "bar" in the output file', () => {
    const outputFile = path.join(__dirname, 'build', 'index.html');
    const outputContent = fs.readFileSync(outputFile, 'utf8');

    expect(outputContent).not.toContain('foo');
    expect(outputContent).toContain('bar');
  });
});
