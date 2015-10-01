Template.list.viewmodel({
    userId : function(){
        return this.parent().userId();
    },
    votes : function(){
        return Votes.find({userId : this.userId()},{sort : {bestScore : -1, badScore : 1}});
    },
    autorun : function(c){
        this.templateInstance.subscribe('votesByUser', this.userId());
    }
},'votes');

Template.vote.viewmodel(function(data){
    return {
        id : data._id,
        vote : function () {
            return data;
        },
        thumb : function(){
            var image = data.images[data.chooseImage];
            return (image && image.url) ? image.url : '/no_thumbnail.jpg';
        },
        removeItem : function(){
            Meteor.call('RemoveVote',this.vote()._id);
        },
        upItem : function(){
            console.info('UP VOTE!')
            Meteor.call('updateVote', this.vote()._id, 'UP');
        },
        downItem : function(){
            console.warn('DOWN VOTE!');
            Meteor.call('updateVote', this.vote()._id, 'DOWN');
        }
    }
})