window.addEventListener('DOMContentLoaded', () => {
    
    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if (target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer
    const deadlline = '2021-10-20T18:00';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000* 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / (1000 * 60)) % 60),
              seconds = Math.floor((t / 1000) % 60);
        return {
             'total': t,
             'days': days,
             'hours': hours,
             'minutes': minutes,
             'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        }
        else{
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();
        
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0 ) {
                clearInterval(timeInterval);
            }
        }
    }

    //ModalWindow

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        //modal.classList.toggle('show');
        document.body.style.overflow = "hidden";
        //clearInterval(modalTimerId);
    }
    
    function closeModal() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        //modal.classList.toggle('show');
        document.body.style.overflow = "";
    }

    modalTrigger.forEach(element => {
        element.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == ''){
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code == "Escape" && modal.classList.contains('show')){
            closeModal();
        }
    });

    //const modalTimerId = setTimeout(openModal, 3000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= 
            document.documentElement.scrollHeight){
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //Menu_field
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...clases){
            this.src = src;
            this.srcAlt = alt;
            this.subtitle = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.clases = clases;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if(this.clases.length == 0){
                this.element = "menu__item";
                element.classList.add(this.element);
            }
            else{
                this.clases.forEach(className => element.classList.add(className));
            }
            element.innerHTML = 
                `<img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>`;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    // });

    axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

    //Forms

    const forms = document.querySelectorAll('form');
    const messsage = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindpostData(item);
    });

    // fetch('http://localhost:3000/menu')
    // .then(data => data.json())
    // .then(res => console.log(res));

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindpostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = messsage.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(messsage.success); 
                statusMessage.remove();
            })
            .catch(()=>{
                showThanksModal(messsage.failure);
            })
            .finally(()=>{
                form.reset();
            });
        });
    }

    function showThanksModal(messsage){
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close="" class="modal__close">×</div>
                <div class="modal__title">${messsage}</div>
            </div>`;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        },4000);
    }


    //Slider

    const slides = document.querySelectorAll('.offer__slide');
    const slider = document.querySelector('.offer__slider');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    let total = document.querySelector('#total');
    let current = document.querySelector('#current');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width; 
    let offset = 0;
    let slideIndex = 1;
    const indicators = document.createElement('ol');
    const dots = [];

    function deleteNotDigits(width){
        return +width.replace(/\D/g, '');
    }

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }
    else{
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+1);
        dot.classList.add('dot');
        if(i == 0){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click', (e) => {
        if (offset == deleteNotDigits(width) * (slides.length - 1)){
            offset = 0;
        }
        else{
            offset += deleteNotDigits(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length){
            slideIndex = 1;
        }
        else{
            slideIndex++;
        }

        if (slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }
        else{
            current.textContent = slideIndex;
        }

        dots.forEach(dot => {
            dot.style.opacity = '.5';
        });
        dots[slideIndex-1].style.opacity = 1;
    });

    prev.addEventListener('click', (e) => {
        if (offset == 0){
            offset = deleteNotDigits(width) * (slides.length - 1);
        }
        else{
            offset -= deleteNotDigits(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1){
            slideIndex = slides.length;
        }
        else{
            slideIndex--;
        }

        if (slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }
        else{
            current.textContent = slideIndex;
        }
        
        dots.forEach(dot => {
            dot.style.opacity = '.5';
        });
        dots[slideIndex-1].style.opacity = 1;

    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e)=>{
            
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;

            offset = deleteNotDigits(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slides.length < 10){
                current.textContent = `0${slideIndex}`;
            }
            else{
                current.textContent = slideIndex;
            }

            dots.forEach(dot => {
                dot.style.opacity = '.5';
            });
            dots[slideIndex-1].style.opacity = 1;
        });
    });


    //Calculator

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if(localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    }
    else{
        sex = 'female';
        localStorage.setItem('sex', sex);
    }

    if(localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    }
    else{
        ratio = 1.375;
        localStorage.setItem('ratio', ratio);
    }

    function initLocalSettings(selector, activeClass){
        const  elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            }
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
        });
    }

    function calcTotal(){
        if(!sex || !height || !weight || !age || !ratio){
            result.textContent = '____';
            return;
        }

        if(sex == 'female'){
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }
        else{
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    function getStaticInformation(selector, activeClass){
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                }
                else{
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }
                console.log(ratio, sex);
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    function getDinamicInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if(input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            }
            else{
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
                default:
                    break;
            }
            calcTotal();
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');


    hideTabContent();
    showTabContent();
    setClock('.timer', deadlline);
});