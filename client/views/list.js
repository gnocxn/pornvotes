Template.list.viewmodel({
    userId: function () {
        return this.parent().userId();
    },
    votes: function () {
        return Votes.find({userId: this.userId()}, {sort: {bestScore: -1, badScore: 1}});
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
        thumb: function () {
            var images = this.vote().thing().images,
                noImage = '/no_image_available.jpg';
            return (!this.vote().chooseImage) ? ((images) ? images[0].url : noImage) : this.vote().chooseImage;
        },
        removeItem: function () {
            Meteor.call('RemoveVote', this.vote()._id);
        },
        modalInstance: null,
        showModal: function () {
            var modalInstance = Blaze.renderWithData(Template.editVote, this.vote(), document.getElementsByTagName('body')[0],null, Template.instance());
            this.modalInstance(modalInstance);
            $("#myModal").modal({
                "title": "Edit",
                "backdrop": "static",
                "keyboard": true,
                "show": true,                     // ensure the modal is shown immediately
            });
            var self = this;
            $('#myModal').on('hidden.bs.modal',function(e){
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
            console.info('UP VOTE!')
            Meteor.call('updateVote', this.vote()._id, 'UP');
        },
        downItem: function () {
            console.warn('DOWN VOTE!');
            Meteor.call('updateVote', this.vote()._id, 'DOWN');
        },
        autorun: function (c) {
            this.templateInstance.subscribe('thingById', data.thingId);
        }
    }
});

Template.editVote.viewmodel(function (data) {
    return {
        title: data.thing().title,
        description: data.thing().description || '',
        images: function () {
            if(data.chooseImage) this.selectedImage(data.chooseImage);
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
})