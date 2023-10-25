module.exports = function (grunt) {
    grunt.initConfig({
      cssmin: {
        target: {
          files: {
            'public/minified/minified.css': ['public/css/*.css']
          }
        }
      },
      uglify: {
        target: {
          files: {
            'public/minified/minified.js': ['public/js/*.js']
          }
        }
      }
    });
  
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
  
    // Default task: minify CSS and JavaScript
    grunt.registerTask('default', ['cssmin', 'uglify']);
  };
  