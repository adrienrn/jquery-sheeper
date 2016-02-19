module.exports = function(grunt) {

  // Dependencies.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jekyll');

  // Definitions.
  var jsSrc     = [
        'src/jquery.sheeper.js'
      ],
      jsDeps    = [
        'bower_components/jquery/dist/jquery.js'
      ],
      jsDist    = 'dist/jquery.sheeper.js',
      jsDistMin = 'dist/jquery.sheeper.min.js',
      jsDocs    = 'docs/assets/js/demo.js';

  // Configuration.
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: jsSrc,
        dest: jsDist
      },
      docs: {
        src: jsDeps.concat(jsSrc),
        dest: jsDocs
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: jsSrc,
        dest: jsDistMin
      }
    },
    jekyll: {
      options: {
      },
      dev: {
        options: {
          src: 'docs/',
          dest: 'docs/_site'
        }
      },
      dist: {
        options: {
          src: 'docs/',
          dest: 'docs/_site',
          raw: 'baseurl: /jquery-sheeper'
        }
      }
    },
    watch: {
      scripts: {
        files: jsSrc,
        tasks: ['scripts:dev']
      },
      docs: {
        files: ['docs/**/*', '!docs/_site/**/*', '!docs/assets/js/demo.js'],
        tasks: ['jekyll:dev']
      }
    }
  });

  // Dev
  grunt.registerTask('scripts:dev', ['concat:dist', 'concat:docs']);
  grunt.registerTask('dev', ['scripts:dev']);

  // Docs
  grunt.registerTask('docs-dev', ['jekyll:dev']);
  grunt.registerTask('docs-dist', ['jekyll:dist']);

  // Dist.
  grunt.registerTask('scripts:dist', ['scripts:dev', 'uglify']);
  grunt.registerTask('dist', ['scripts:dist']);

  // Watch
  grunt.registerTask('default', ['dev', 'watch']);
};
