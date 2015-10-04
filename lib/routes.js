if(Meteor.isClient){
    BlazeLayout.setRoot('body');
}


FlowRouter.route('/',{
    name : 'loading',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{main : 'loading'});
    }
});

FlowRouter.route('/u/:userId',{
    name : 'home',
/*    subscriptions : function(p, q){
        this.register('myUser', Meteor.subscribe('peopleById', p.userId));
    },*/
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{main : 'home'});
    }
});

/*FlowRouter.route('/l/:listId',{
    name : 'list',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{main : 'list'});
    }
});*/

FlowRouter.route('/out/:url',{
    name : 'out',
    action : function(p, q){
        var url = decodeURIComponent(p.url);
        window.location.href = url;
    }
});

FlowRouter.route('/if/:listId',{
    name : 'iframe',
    subscriptions : function(p, q){
        this.register('myUser', Meteor.subscribe('peopleByListId', p.listId));
    },
    action : function(p, q){
        BlazeLayout.render('iframeLayout',{main : 'iframe'});
    }
});
