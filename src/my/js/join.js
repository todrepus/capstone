function SpaceException(name, message){
    this.name = name;
    this.message = message;
}

function NotPhoneNumberException(name, message){
    this.name = name;
    this.message = message;
}

function UpdateErrorException(message){
    this.name = "UpdateErrorException";
    this.message = message;
}



function CheckValid(){
    try{
        let phone_number = document.getElementById('phone_number').value;
        let name = document.getElementById('name').value;
        let password = document.getElementById('password').value;
        let nickname = document.getElementById('nickname').value;
        let email = document.getElementById('email').value;
        
        phone_number = phone_number.trim()
        password = password.trim();
        name = name.trim();
        nickname = nickname.trim();
        email = email.trim();

        if (name === ""){
            document.getElementById('name').focus();
            throw new SpaceException('SpaceException', '이름이 공백입니다.');
        }
        if (password === ""){
            document.getElementById('password').focus();
            throw new SpaceException('SpaceException', '비밀번호가 공백입니다.');
        }
        if (nickname === ""){
            document.getElementById('nickname').focus();
            throw new SpaceException('SpaceException', '별명이 공백입니다.');
        }

        if (phone_number === ""){
            document.getElementById('phone_number').focus();
            throw new SpaceException('SpaceException', '핸드폰번호가 공백입니다.');
        }

        if (email === ""){
            document.getElementById('email').focus();
            throw new SpaceException('email', '이메일이 공백입니다.');
        }

        let regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (regPhone.test(phone_number) != true){ // 휴대폰번호 형식이 아니라면,
            throw new NotPhoneNumberException('NotPhoneNumberException', '핸드폰번호 형식 이상합니다.');
        }
        return true;
    }catch(event){
        if (event instanceof SpaceException ){
            alert(event.message);
        }else if (event instanceof NotPhoneNumberException){
            alert(event.message);
        }
        return false;
    }


}

window.CheckValid = CheckValid;