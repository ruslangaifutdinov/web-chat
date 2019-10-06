
    var socket = io.connect('http://localhost:3000');
    var messageArea = document.querySelector(".message-input");
    var messageBtn = document.querySelector(".message-btn");
    var allMessages = document.querySelector(".message-person");
    var nameUser = document.querySelector("#name");
    var nicknameUser = document.querySelector("#nickname");
    var personItem = document.querySelector(".name-person");
    var authBtn = document.querySelector(".auth-btn");
    let modalWindow = document.querySelector('.modal');
    let person = document.querySelector('.person');
    var contacts = document.querySelector('.main-contacts');
    var listMess = document.querySelector('.list-mess');
    var messageColor = document.querySelector('.message-person__style');
    var imgPerson = document.querySelector('.img-person');

    const arrayMessage = [];
    const arrayPerson = [];
    var userid = '';
    
    const personObj = {
        list: arrayPerson
    };
    
    const objMessage = {
        list: arrayMessage
    }
    var count = 0;

    // Инфа из модалки на авторизацию
    authBtn.addEventListener('click', function(e){
        e.preventDefault();

        socket.emit('new_person', 
        {
            username: nameUser.value,
            userid: userid
        })

        modalWindow.classList.add('modal-none');
    });

    messageBtn.addEventListener('click', function (e){
        e.preventDefault();

        var date = new Date();
        var dateOptions = {
            hour: "numeric",
            minute: "numeric"
          };
        let sentDate = date.toLocaleString("ru", dateOptions);

        var name = 'U' + (socket.id).toString().substr(1,4);
        userid = name;

        socket.emit('new_mess', 
        {
            mess: messageArea.value,
            username: nameUser.value,
            date: sentDate,
            userid: userid
        })
    });

    socket.on('new_mess', function(data) {
        arrayMessage.push(data);
        console.log(data);

        sentMessage ();

        messageArea.value = '';
    });

    socket.on('new_person', function(data) {
        console.log(data);
        arrayPerson.push(data);
        console.log(arrayPerson);

        if (arrayPerson.length) {
            personAdd();
            count++;
        }

    });

    function personAdd () {
        const template = document.querySelector("#push-persons").textContent;
        const render = Handlebars.compile(template);
        const htmlComments = render(personObj);
        contacts.innerHTML = htmlComments;
    }

    function sentMessage () {
        const templateMessage = document.querySelector("#push-message").textContent;
        const renderMessage = Handlebars.compile(templateMessage);
        const htmlSentMessage = renderMessage(objMessage);
        allMessages.innerHTML = htmlSentMessage;
    }

    imgPerson.addEventListener('click', (e) => {
        e.preventDefault();

        upload.style.display = 'flex';
    });