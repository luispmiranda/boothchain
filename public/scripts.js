var boothchain = window.boothchain;
if (!boothchain) {
    boothchain = window.boothchain = {};
    boothchain.imgUpload = {};
}

// Initialise events and handlers
boothchain.imgUpload.init = function () {
    // When clicking on Add Photo, trigger file upload dialog
    $('#add-photo').on('click', function (ev) {
        $('#img-upld').trigger('click');
        ev.preventDefault();
    });

    // Event functions
    $('#img-upld').change(function (ev) {
        // Get a reference to the taken picture or chosen file
        var files = ev.target.files;
        var image;
        if (files && files.length > 0) {
            image = files[0];
        }
        if (image) {
            boothchain.imgUpload.preview(ev, image);
        }
    });
}
// Preview uploaded image on the left side container
boothchain.imgUpload.preview = function(ev, file, previewID, index, jqXHR){
    var imgURL    = window.URL.createObjectURL(file);
    var container = $('.preview-container');

    var img = container.find('#img-preview');
    img.attr('src', imgURL).load(function(){
        container.show();
        
        // Hide add-photo button
        $('#add-photo').hide();

        // Hide welcome menu
        $('#welcome-section').hide();

        // Show step 2
        $('#step-2').show();
    });
};


(function() {
    $(document).ready(function(){
        if($('input#img-upload')) {
            boothchain.imgUpload.init();
        }
    });
})();

