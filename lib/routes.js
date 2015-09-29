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
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{main : 'home'});
    }
});

FlowRouter.route('/l/:listId',{
    name : 'list',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{main : 'list'});
    }
})