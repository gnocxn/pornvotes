Template.loading.rendered = function(){
    var self = this;
    self.autorun(function(c){
        var userId = Meteor.cookie.get('pv_userId');
        if(userId){
            var params = {
                userId : userId
                },
                path = FlowRouter.path('home',params);
            c.stop();
            FlowRouter.go(path);
        }else{

        }
    })
}

Template.loading.viewmodel({
    ipAddress : function(){
        return 'Loading...' + headers.getClientIP();
    }
})