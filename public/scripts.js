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

    $('#pay-with-exposure').on('click', function (ev) {
        var target = 'https://wallet.pixels.camp/?to=0x97da70d831d537e4ff3cedef56f566b8374a22fd&value=30#send-transaction';
        //var url = $(this).attr('href').attr('target','_blank');        
        window.open(target, '_blank');
        ev.preventDefault();       
    });

    // When clicking on the pay with exposure
    $('#validate').on('click', function (event) {
        $.ajax({
            url: '/api/print',
            type: 'POST',
            data: new FormData($('#image-form')[0]),
            processData: false,
            contentType: false
        });
        event.preventDefault();
        
        checkTxId($('#tx-id').val());
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

    $('#input-brightness').change(function(ev){
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
    const contrast = 10;
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


function post(url, data, call) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            call(json);
        }
    };
    var data = JSON.stringify(data);
    xhr.send(data);
};

function checkTxId(tx) {
    var rpc = 'https://moon.pixels.camp:8549';
    post(rpc,
        {
            "jsonrpc":"2.0",
            "method":"eth_getTransactionByHash",
            "params": [tx],
            "id": "123",
        }, function(r) {
            try {
                $('.receipt').show();
                $('.main').hide();
                if (r.error) {
                    throw r.error;
                }
            } catch(e) {
                $('.receipt').show();
                $('.receipt-text').text('Something went wrong, please try again with a valid transaction id');
            }
    });

}
