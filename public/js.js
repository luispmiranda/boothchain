function printImage() {
    return fetch('/api/print', {
        method: 'POST',
        body: {
            z1: 1, // document.getElementById('z1').value,
            z2: 2, // document.getElementById('z2').value,
            data: new FormData()
        }
    }).then((response) => {
        return response;
    });
}

function test() {
    alert('ola');
}