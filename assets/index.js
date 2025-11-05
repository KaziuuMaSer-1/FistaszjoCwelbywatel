var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")){
        selector.classList.remove("selector_open")
    }else{
        selector.classList.add("selector_open")
    }
})

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

var sex = "m"

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {

    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })

});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

// Zmodyfikowana sekcja z obsługą błędów dla ładowania zdjęcia
imageInput.addEventListener('change', (event) => {

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");

    upload.removeAttribute("selected")

    var file = imageInput.files[0];
    var data = new FormData();
    data.append("image", file);

    fetch('https://api.imgur.com/3/image' ,{ // Upewnij się, że nie ma zbędnych spacji przed URL
        method: 'POST',
        headers: {
            // Upewnij się, że ten Client-ID jest poprawny
            'Authorization': 'Client-ID ec67bcef2e19c08'
        },
        body: data
    })
    .then(result => {
        // Sprawdź, czy odpowiedź HTTP była pomyślna
        if (!result.ok) {
            // Rzuć błąd, jeśli status to np. 400, 403, 500
            throw new Error('Błąd HTTP ' + result.status + '. Sprawdź Client-ID i limit żądań.');
        }
        return result.json();
    })
    .then(response => {
        
        // Sprawdź, czy API Imgur zwróciło sukces w odpowiedzi
        if (response.success === false) { 
             throw new Error('Błąd API Imgur: ' + (response.data.error || 'Nieznany błąd Imgur'));
        }

        var url = response.data.link;
        upload.classList.remove("error_shown")
        upload.setAttribute("selected", url);
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");
        upload.querySelector(".upload_uploaded").src = url;
        console.log('Zdjęcie załadowane pomyślnie. URL:', url); // Komunikat dla dewelopera

    })
    .catch(error => {
        // Główna sekcja obsługi błędów: wyłącza ładowanie i sygnalizuje problem
        console.error('KRYTYCZNY BŁĄD podczas ładowania zdjęcia:', error);
        
        // Resetuje stan ładowania
        upload.classList.remove("upload_loading");
        
        // Wyświetla komunikat błędu
        upload.classList.add("error_shown"); 
        
        // Opcjonalnie: alert dla użytkownika
        alert("Wystąpił błąd podczas dodawania zdjęcia! Spróbuj ponownie. Szczegóły w konsoli przeglądarki (F12)."); 
    });

})

document.querySelector(".go").addEventListener('click', () => {

    var empty = [];

    var params = new URLSearchParams();

    params.set("sex", sex)
    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown")
    }else{
        params.set("image", upload.getAttribute("selected"))
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value
        if (isEmpty(element.value)){
            dateEmpty = true;
        }
    })

    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    }else{
        params.set("birthday", birthday)
    }

    document.querySelectorAll(".input_holder").forEach((element) => {

        var input = element.querySelector(".input");

        if (isEmpty(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        }else{
            params.set(input.id, input.value)
        }

    })

    if (empty.length != 0){
        empty[0].scrollIntoView();
    }else{

        forwardToId(params);
    }

});

function isEmpty(value){

    let pattern = /^\s*$/
    return pattern.test(value);

}

function forwardToId(params){

    location.href = "/FistaszjoCwelbywatel/id?" + params

}

var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {

    if (guide.classList.contains("unfolded")){
        guide.classList.remove("unfolded");
    }else{
        guide.classList.add("unfolded");
    }

})
