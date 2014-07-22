$(function () {
    "use strict";

    function handleTypeButtonClick(event) {
        $("#email-form input[name=type]").val($(event.currentTarget).val());
        $("#email-form").show();
        $("#type-buttons").hide();
    }

    $("#type-buttons .input-button").on("click", handleTypeButtonClick);
});