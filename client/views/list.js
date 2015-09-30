Template.list.viewmodel(function(userId){
    return{
        userId : userId,
        votes : function(){
            return Votes.find({userId : this.userId()});
        }
    }
})

Template.vote.viewmodel(function(data){
    return {
        id : data._id,
        vote : function () {
            return Votes.findOne(this.id())
        }
    }
})