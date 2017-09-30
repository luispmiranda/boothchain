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

    // When clicking on the pay with exposure
    $('#pay-with-exposure').on('click', function (event) {
        $.ajax({
            url: '/api/print',
            type: 'POST',
            data: new FormData($('#image-form')[0]),
            processData: false,
            contentType: false
        });
        event.preventDefault();        
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

    $('#input-contrast').change(function(ev){
        var val = $(this).val();
        console.log($(this).val());
        boothchain.imgUpload.setFilters(ev);
    });
}
// Preview uploaded image on the left side container
boothchain.imgUpload.preview = function(ev, file, previewID, index, jqXHR){
    var imgURL    = window.URL.createObjectURL(file);
    var container = $('.preview-container');

    var img = container.find('#img-preview');
    img.attr('src', imgURL).load(function(){
        $('.section-00').hide();
        $('.section-01').hide();
        $('.section-02').show();
        $('.section-03').show();
    });
};

boothchain.imgUpload.setFilters = function () {
    const elem = $(this);
    // Get value from ranges
    const contrast = $('#input-contrast').val();
    const brightness = $('#input-brightness').val();

    // Calculate intermediate values
    var c = +contrast-0.2;
    var b = +brightness-0.2;

    // Calculate request values
    var z1 = ((+c-1)/(2*+b*+c));
    var z2 = ((+c+1)/(2*+b*+c));

    $('input#z1').val(z1);
    $('input#z2').val(z2);

    const filter = 'grayscale(100%) brightness('+brightness+') contrast('+contrast+')';
    
    var img = $('#img-preview');
    img.css('-webkit-filter', filter);
    img.css('filter', filter);
};

(function() {
    $(document).ready(function(){
        if($('input#img-upload')) {
            boothchain.imgUpload.init();
        }
    });
})();

