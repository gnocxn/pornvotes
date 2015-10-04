Things = new Meteor.Collection('things');
Votes = new Meteor.Collection('votes');
People = new Meteor.Collection('people');
AnonymousVotes = new Meteor.Collection('anonymousVotes');

Votes.helpers({
    thing : function(){
        var original = Things.findOne({_id : this.thingId}),
            original = _.omit(original,'_id', 'updatedAt');
        var anoVotes = AnonymousVotes.find({voteId : this._id}).fetch(),
            upVote = _.where(anoVotes, {type : 'UP'}).length || 0,
            downVote = _.where(anoVotes,{type : 'DOWN'}).length || 0;
        var newObj = _.extend(original, {upVote : upVote, downVote : downVote}, this);
        //console.log(newObj);
        return newObj;
    }
});