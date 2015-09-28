Template.home.events({
    'click #btnAddMovieToList' : function(e,t){
        e.preventDefault();
        addMovie();
    },

    'keyup #txtMovieUrl' : function(e,t){
        e.preventDefault();
        if(e.keyCode === 13){
            addMovie();
        }
    }
});

var addMovie = function(){
    console.info('Movie added!')
}