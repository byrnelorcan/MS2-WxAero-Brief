/*window.onload = function () {
    document.getElementById('email_brief').addEventListener('submit', function (event) {
        event.preventDefault();
        
        this.taf_raw.text = document.getElementById('taf_raw');
        this.metar_raw.text = document.getElementById('metar_raw');
      
        emailjs.sendForm('from_name', 'from_email', this)
            .then(function () {
                console.log('SUCCESS!');
            }, function (error) {
                console.log('FAILED...', error);
            });
    });
}*/