Template.list.viewmodel({
    userId: function () {
        return this.parent().userId();
    },
    votes: function () {
        return Votes.find({userId: this.userId()}, {sort: {bestScore: -1, badScore: 1}});
    },

    isOwner: function () {
        var userId1 = FlowRouter.getParam('userId') || Random.id(5),
            userId2 = Meteor.cookie.get('pv_userId') || Random.id(5);
        return userId1 !== userId2
    },
    autorun: function (c) {
        this.templateInstance.subscribe('votesByUser', this.userId());
    }
}, 'votes');

Template.vote.viewmodel(function (data) {
    return {
        id: data._id,
        vote: function () {
            return Votes.findOne(this.id());
        },
        thumbCssClass: function () {
            return (this.vote().thing().provider_name === 'YouTube') ? 'thumbnailClip youtubeThumbClip' : 'thumbnailClip'
        },
        thumb: function () {
            var images = this.vote().thing().images,
                noImage = '/no_image_available.jpg';
            return (!this.vote().chooseImage) ? ((images) ? images[0].url : noImage) : this.vote().chooseImage;
        },
        allowEdit : function(){
            return this.parent().isOwner();
        },
        outUrl: function () {
            var params = {
                url: encodeURIComponent(this.vote().thing().url)
            };
            return FlowRouter.path('out', params);
        },
        clickOutUrl : function(){
            analytics.track('Click movie',{
                _id : this.vote()._id,
                title : this.vote().thing().title,
                url : this.vote().thing().url,
                clientIp : headers.getClientIP()
            });
        },
        removeItem: function () {
            Meteor.call('RemoveVote', this.vote()._id);
        },
        modalInstance: null,
        showModal: function () {
            var modalInstance = Blaze.renderWithData(Template.editVote, this.vote(), document.getElementsByTagName('body')[0], null, Template.instance());
            this.modalInstance(modalInstance);
            $("#myModal").modal({
                "title": "Edit",
                "backdrop": "static",
                "keyboard": true,
                "show": true,                     // ensure the modal is shown immediately
            });
            var self = this;
            $('#myModal').on('hidden.bs.modal', function (e) {
                self.closeModal();
            })
        },
        closeModal: function () {
            if (this.modalInstance()) {
                Blaze.remove(this.modalInstance());
                this.modalInstance(null);
            }
        },
        upItem: function () {
            var clientIp = headers.getClientIP();
            var vote = {
                _id : this.vote()._id,
                title : this.vote().thing().title
            }
            var type = 'UP';
            Meteor.call('updateVote', this.vote()._id, type, clientIp,function(err, rs){
                if(err) console.log(err);
                if(rs && rs === true){
                    trackEventVote(vote, type, clientIp);
                }
            });
        },
        downItem: function () {
            var clientIp = headers.getClientIP();
            var vote = {
                _id : this.vote()._id,
                title : this.vote().thing().title,
                provider_name : this.vote().thing().provider_name,
                url : this.vote().thing().url,
            }
            var type = 'DOWN';
            Meteor.call('updateVote', this.vote()._id, type, clientIp,function(err, rs){
                if(err) console.log(err);
                if(rs && rs === true){
                    trackEventVote(vote, type, clientIp);
                }
            });
        },
        autorun: function (c) {
            this.templateInstance.subscribe('thingById', data.thingId);
            this.templateInstance.subscribe('voteTypesByVote', data._id);
        }
    }
});

Template.editVote.viewmodel(function (data) {
    return {
        title: data.thing().title,
        description: data.thing().description || '',
        images: function () {
            if (data.chooseImage) this.selectedImage(data.chooseImage);
            var images = _.map(data.thing().images, function (i) {
                    return i.url;
                }),
                noImage = ['/no_image_available.jpg'];
            return _.union(images, noImage);
        },
        selectedImage: null,
        saveVote: function () {
            var modifierVote = {
                title: this.title(),
                description: this.description(),
                chooseImage: (this.selectedImage()) ? this.selectedImage() : this.images()[0]
            }
            var self = this;

            Meteor.call('editVote', data._id, modifierVote, function (err, rs) {
                if (err) console.log(err);
                if (rs && rs === true) {
                    $("#myModal .closeModal").click();
                }
            })
        }
    }
}, 'images');

Template.editVote_chooseImage.viewmodel(function (src) {
    return {
        src: src,
        select: function () {
            return this.parent().selectedImage(this.src());
        },
        isSelected: function () {
            return (this.parent().selectedImage() === this.src()) ? 'selected' : ''
        }
    }
});

var trackEventVote = function(vote ,type, clientIp){
    analytics.track('Vote Event',{
        vote : vote,
        type : type,
        clientIp : clientIp
    });
}