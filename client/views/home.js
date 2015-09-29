Template.home.onCreated(function(){
    this.subscribe('movies');
})

Template.home.viewmodel({
    movieUrl : '',
    showLoading : false,
    addMovie : function(){
        if(is.url(this.movieUrl())){
            console.log('Success');
        }
    }
})