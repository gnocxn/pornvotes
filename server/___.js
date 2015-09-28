if(Meteor.isServer){
    var baseUrl = 'http://api.embed.ly/1/';
    var embedKey = Meteor.settings.private.EmbedlyApiKey || null;
    //var qs = Npm.require('querystring');
    Meteor.methods({
        Embedly_Extract : function(url){
            if(Match.test(embedKey,String)){
                var query = {
                    key : embedKey,
                    url : encodeURIComponent(url)
                }
                var urlApi = baseUrl+'extract?' + 'key=' + query.key + '&url=' + query.url;
                var result = request.getSync({url : urlApi, json : true});
                return result.body;
            }
            return false;
        }
    })
}