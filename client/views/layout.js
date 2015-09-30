Template.loading.rendered = function () {
    var self = this;
    self.autorun(function (c) {
        var userId = Meteor.cookie.get('pv_userId');
        if (!userId) {
            createNewUser();
        }
        if (userId) {
            var user = People.findOne({_id: userId});
            if (!user) {
                //console.log('aaaaaaaaa');
                createNewUser();
            } else {
                var params = {
                        userId: user._id || userId
                    },
                    path = FlowRouter.path('home', params);
                console.log(path);
                c.stop();
                FlowRouter.go(path);
            }
        }
    })
}

var createNewUser = function () {
    var clientIp = headers.getClientIP()
    Meteor.call('Create_User', clientIp, function (err, rs) {
        if (rs) {
            Meteor.cookie.set('pv_userId', rs);
            location.reload(true);
        }
    });
}

Template.loading.viewmodel({
    ipAddress: function () {
        return 'Loading...' + headers.getClientIP();
    }
})