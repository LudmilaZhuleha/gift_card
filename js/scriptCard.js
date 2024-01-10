const API_URL = "https://grape-mountainous-giraffe.glitch.me/";
const card = document.querySelector('.card');
const cardTitle = document.querySelector('.card__title');
const cardContacts = document.querySelector('.card__contacts');

const cardImage = document.querySelector('.card__front--image');
const cardFrom = document.querySelector('.card__from');
const cardTo = document.querySelector('.card__to');
const cardMessage = document.querySelector('.card__message');

const rearrangeElement = () => {
    const screenWidth = window.innerWidth;
    if(screenWidth <= 580) {
        cardContacts.after(card);
    } else {
        cardContacts.after(cardTitle);
    }
}
//Получение id отправленной открытки
const getIdFromUrl = () =>{
    const params = new URLSearchParams(location.search);
    return params.get('id');
}
//Получение с сервера данных отправленной открытки

const getGiftData = async(id) => {
    try {
        const response = await fetch(`${API_URL}/api/gift/${id}`);
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Открытка не найдена!');
        }
    } catch (error) {
        console.error(error);
    }
}

rearrangeElement();

const init = async () => {
    rearrangeElement();
    window.addEventListener("resize", rearrangeElement);

    const id = getIdFromUrl();
    console.log("id: ", id);
    if(id) {
        const data = await getGiftData(id);
        if(data) {
            cardImage.src = `img/${data.card}.jpg`
            cardFrom.textContent = data.sender_name;
            cardTo.textContent = data.receiver_name;
            const formattedMessage = data.message.replace('/\n/', '<br>');
            cardMessage.innerHTML = formattedMessage;

        }
    }
    
}

init();