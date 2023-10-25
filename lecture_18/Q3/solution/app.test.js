import fs from 'fs';
import { promisify } from 'util';
import { spawn } from 'child_process';
// import { destFolder } from 'gulp-imagemin';
const readdir = promisify(fs.readdir);
import path from 'path';

describe('Gulp Task Test', () => {
  let minifiedPath = 'dest/files';

  beforeAll(() => {
    fs.readdirSync(minifiedPath).forEach((file) => {
      const filePath = path.join(minifiedPath, file);
      fs.unlinkSync(filePath);
    });
  });

  it('should have gulp-concat installed', () => {
    try {
      // Attempt to resolve the 'gulp-concat' module
      require.resolve('gulp-concat');

      // If it's resolved without errors, the package is installed
      expect(true).toBe(true);
    } catch (error) {
      // If there is an error, the package is not installed
      expect(false).toBe(true);
    }
  });

  it('some files should be present in src/files', () => {
    // Path to the source folder
    const srcFolder = 'src/files';

    // Get a list of files in the source folder
    const files = fs.readdirSync(srcFolder);

    // Filter the files to check if there are image files (e.g., with '.jpg' or '.png' extensions)

    let cnt = 0;
    let exts = ['.js', '.json', '.css', '.html'];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      console.log(ext);
      if (exts.includes(ext)) {
        cnt++;
      }
      // console.log(ext);
    });

    // Assert that at least one image file is present
    expect(cnt).toBeGreaterThan(0);
  });

  it('should create concatenated file', async () => {
    // Path to the source folder
    const srcFolder = 'src/files';

    // Run the Gulp task
    const gulpProcess = spawn('gulp', ['default'], { stdio: 'inherit' });

    // Wait for the Gulp task to complete
    await new Promise((resolve) => {
      gulpProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          throw new Error(`Gulp task failed with code ${code}`);
        }
      });
    });

    // Check if the destination folder exists

    expect(fs.existsSync(minifiedPath)).toBe(true);
    const files = await readdir(minifiedPath);
    expect(files.length).toBeGreaterThan(0);
  });
});
