const API_URL = "https://grape-mountainous-giraffe.glitch.me/";

const swiperThumb = new Swiper('.gift__swiper--thumb', {
   spaceBetween: 12,
   slidesPerView: "auto",
   freeMode: true,
   watchSlidesProgress: true,
   breakpoints: {
      320: {
         spaceBetween: 12,
      },
      1141: {
         spaceBetween: 16,
      }
   }
});

const swiperMain = new Swiper('.gift__swiper--card', {
   spaceBetween: 16,
   thumbs: {
      swiper: swiperThumb,
   },
});

const phoneInputs = document.querySelectorAll('.form__field--phone');
const form = document.querySelector('.form');
const submitButton = form.querySelector('.form__button');
const cardInput = form.querySelector('.form__card');

//Получение активного слайда с открыткой и запись его в форму
const updateCardInput = () =>{
   const activeSlide = document.querySelector('.gift__swiper--card .swiper-slide-active');
   const cardData = activeSlide.querySelector('.gift__card-image').dataset.card;
   console.log("cardData :", cardData);
   cardInput.value = cardData;
}

updateCardInput();
swiperMain.on("slideChangeTransitionEnd", updateCardInput);

const maskForPhone = (array) => {
      return array.forEach((i) => {
         IMask(i, {
            mask: "+375(00)-000-00-00",
         })
      });
};

maskForPhone(phoneInputs);

const updateSubmitButton = () => {
   let isFormFilled = true;
   for(const field of form.elements) {
      if(field.classList.contains('form__field')) {
         if(!field.value.trim()) {
            isFormFilled = false;
            break;
         }
      }
   }
   submitButton.disabled = !isFormFilled;
}
const phoneValidateOption = {
   
   format: {
      pattern: "\\+375\\(\\d{2}\\)\\d{3}-\\d{2}-\\d{2}",
      message: 'Номер должен соответствовать формату: "+375(хх)-ххх-хх-хх"'
      }
   }

form.addEventListener("input", updateSubmitButton);

form.addEventListener("submit", async (event) => {
   event.preventDefault();

   const errors = validate(form, {
   sender_phone: phoneValidateOption,
   receiver_phone: phoneValidateOption,
   });

   // if(errors) {
   //    for(let key in errors) {
   //       const errorString = errors[key];
   //       alert(errorString);
   //    }
   //    return; 
   // };

   // Получение данных из формы
   const formData = new FormData(form);
   const data = Object.fromEntries(formData);
   console.log("data :", data);

   // Отправка данных на сервер на glitch
   try {
      const response = await fetch(`${API_URL}/api/gift`, {
         method: 'POST',
         headers: {
            "Content-Type": "application/json", 
         },
         body: JSON.stringify(data),
      });
      const result = await response.json();
;
      if(response.ok) {
         prompt('Открытка успешно сохранена. Доступна по адресу: ', `${location.origin}/card.html?id=${result.id}`);
         form.reset();
      } else alert(`Ошибка при отправке: ${result.message}`)

   } catch (error) {
      console.error(`Произошла ошибка при отправке данных ${error}`)
   }
})

