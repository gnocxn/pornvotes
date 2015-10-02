Template.home.onCreated(function(){
    var userId = Meteor.cookie.get('pv_userId');
    this.subscribe('votesByUser', userId);
})

Template.home.viewmodel({
    voteUrl : '',
    showLoading : false,
    buttonIconClass : 'fa fa-plus-square',
    addVoteItem : function(){
        var urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
        if(urlRegex.test(this.voteUrl())){
            //this.showLoading(true);
            this.buttonIconClass('fa fa-spinner fa-pulse');
            var self = this;
            var userId = Meteor.cookie.get('pv_userId');
            Meteor.call('AddThingAndCreateVote', this.voteUrl(), userId,function(err, rs){
                if(err) console.error(err);
                self.buttonIconClass('fa fa-plus-square');
                self.voteUrl('');
            })
        }
    },
    userId : function(){
        return Meteor.cookie.get('pv_userId');
    }
})