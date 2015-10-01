if (Meteor.isServer) {
    Meteor.startup(function () {
        Votes._ensureIndex({url: 1, provider_url: 1});
    })
    var baseUrl = 'http://api.embed.ly/1/';
    var embedKey = Meteor.settings.private.EmbedlyApiKey || null;
    //var qs = Npm.require('querystring');
    Meteor.methods({
        Create_User: function (clientIp) {
            Meteor.sleep(2000);
            var clientIp = clientIp || headers.methodClientIP(this);
            var user = {
                listId: Random.secret(clientIp.length),
                updatedAt: new Date
            }
            return People.insert(user);
        },
        AddVote: function (url, userId) {
            if (Match.test(embedKey, String)) {
                var query = {
                    key: embedKey,
                    url: encodeURIComponent(url)
                }
                var urlApi = baseUrl + 'extract?' + 'key=' + query.key + '&url=' + query.url;
                var result = request.getSync({url: urlApi, json: true});
                var vote = {
                    userId: userId,
                    url: result.body.url,
                    title: result.body.title,
                    description: result.body.description || '',
                    favicon_url : result.body.favicon_url,
                    provider_url: result.body.provider_url,
                    provider_name: result.body.provider_name,
                    provider_display: result.body.provider_display,
                    images: result.body.images || [],
                    chooseImage: 0,
                    upVote: 0,
                    downVote: 0,
                    bestScore: 0,
                    badScore: 0,
                    updatedAt: new Date
                }
                Votes.upsert({userId: userId, url: vote.url}, {
                    $set: vote
                });
                return true;
            }
            return false;
        },
        RemoveVote: function (id) {
            check(id, String);
            Votes.remove({_id: id});
        },
        updateVote: function (id, type) {
            var vote = Votes.findOne({_id: id});
            if (vote) {
                var up = vote.upVote, down = vote.downVote;
                if (type === 'UP')
                    ++up;
                if (type === 'DOWN')
                    ++down;
                var scores = calculateScores(up, (up + down));

                Votes.update({_id: vote._id}, {
                    $set: {
                        upVote: up,
                        downVote: down,
                        bestScore: scores[0],
                        badScore: scores[1]
                    }
                });
                return true;
            }
            return false;
        }
    });

    var calculateScores = function (up, total) {
        var ratio = Meteor.settings.private.Wilson_ratio || "0.9",
            ratio = parseFloat(ratio);
        var thingRanker = new Wilson(ratio);
        var rank = thingRanker.score(up, total);
        return rank;
    }

    Meteor.publish('votesByUser', function (userId) {
        return Votes.find({userId: userId});
    });

    Meteor.publish('peopleById', function (userId) {
        return People.find({_id: userId});
    })
}