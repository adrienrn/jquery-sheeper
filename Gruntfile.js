module.exports = function(grunt) {

  // Je préfère définir mes imports tout en haut
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jekyll');

  var jsSrc = [
    'bower_components/jquery/dist/jquery.js',
    'jquery.sheeper.js'
  ];
  var jsDist = 'docs/assets/js/demo.js';

  // Configuration de Grunt
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      compile: { // On renomme vu qu'on n'a pas de mode dev/dist. Dist étant une autre tâche : uglify
        src: jsSrc, // Vu qu'on doit l'utiliser deux fois, autant en faire une variable.
        dest: jsDist // Il existe des hacks plus intéressants mais ce n'est pas le sujet du post.
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      compile: {
        src: jsSrc,
        dest: jsDist
      }
    },
    jekyll: {
      options: {
      },
      docs: {
        options: {
          src: 'docs/',
          dest: 'docs/_site'
        }
      }
    },
    watch: {
      scripts: {
        files: 'jquery.sheeper.js',
        tasks: ['scripts:dev']
      },
      docs: {
        files: ['docs/**/*', '!docs/_site/**/*'],
        tasks: ['jekyll']
      }
    }
  });

  grunt.registerTask('default', ['dev', 'watch']);
  grunt.registerTask('dev', ['scripts:dev']);
  grunt.registerTask('dist', ['styles:dist', 'scripts:dist']);

  grunt.registerTask('scripts:dev', ['concat:compile']);

  grunt.registerTask('scripts:dist', ['uglify:compile']);
};