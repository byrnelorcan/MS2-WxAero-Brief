(function () {
    emailjs.init('user_XEJI4PEvfunEqy0iycSnQ');
})();

function sendMail(contactForm) {
    emailjs.send("service_fa9cjf3", "template_3kicv7a", {
            "from_name": contactForm.name.value,
            "to_email": contactForm.emailaddress.value,
            "emaildata": contactForm.emaildata.value
        })
        .then(
            function (response) {
                console.log("SUCCESS", response);
            },
            function (error) {
                console.log("FAILED", error);
            }
        );
    return false;
}