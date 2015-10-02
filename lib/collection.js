Things = new Meteor.Collection('things');
Votes = new Meteor.Collection('votes');
People = new Meteor.Collection('people');

Votes.helpers({
    thing : function(){
        var original = Things.findOne({_id : this.thingId}),
            original = _.omit(original,'_id', 'updatedAt');
        return _.extend(original, this);
    }
});