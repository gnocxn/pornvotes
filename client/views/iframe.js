Template.iframe.rendered = function(){
    var clientIp = headers.getClientIP();
    analytics.page('Iframe Page',{
        clientIp : clientIp
    });
}

Template.iframe.viewmodel({
    user : function(){
        var listId = FlowRouter.getParam('listId');
        return People.findOne({listId : listId});
    },
    userId : function(){
        return this.user()._id;
    }
});