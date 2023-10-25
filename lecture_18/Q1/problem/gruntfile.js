// Debug this grunt file in order to minify the files from 
// public/css and public/js directories and save the 'css' and 'js' files inside minified directory.
module.exports = function (grunt) {
  grunt.initialConfig({
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cd: "public/css",
            src: ["*.css", "!*.min.css"],
            dest: "public/minified/",
            ext: ".min.css"
          }
        ]
      }
    },
    uglify: {
      target: {
        files: {
          'public/minified/minified.js': ['public/js/*.jjs']
        }
      }
    }
  });

  grunt.loadNpmtasks('grunt-contrib-cssmin');
  grunt.loadNpmtasks('grunt-contrib-ulify');

  // Default task: minify CSS and JavaScript
  grunt.registerTask('default', ['cssmn', 'uglify']);
};
