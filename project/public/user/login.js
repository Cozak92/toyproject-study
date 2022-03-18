window.onload = () => {
    // 화면 초기화
    initPage();

    // 이벤트 등록
    setEventListener();
};

/**
 * 화면 초기화
 */
function initPage() {

}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 로그인 버튼(->) 클릭시
     */
    document.getElementById('loginSubmit').addEventListener('click', (e) => {
        login();
    });

    /**
     * 회원가입 버튼(->) 클릭시
     */
    document.getElementById('joinSubmit').addEventListener('click', (e) => {
        join();
    });
}

/**
 * 패스워드 입력창에서 엔터키누를시 login
 */
function enterKey() {
    if (window.event.keyCode == 13) {
        login();
    }
}

/**
 * 로그인
 */
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPwd').value;
    const loginUser = {
        email,
        password
    };

    axios.post(`/auth/login`, loginUser)
        .then(res => {
            if (res.data.status === '002') {    // 로그인 성공
                location.href = '/';
            } else {        // 로그인 실패
                document.getElementById('loginMessageBox').classList.remove('noVisible');
            }
        })
        .catch(err => {
            console.error(err);
        }) ;
}

/**
 * 회원가입 유효성 검사
 */
function checkUser(user) {
    const result = false;

    // 입력하지 않은 값이 있을때
    for (let k of Object.keys(user)) {
        if (common.isEmpty(user[k])) {
            document.getElementById('joinMessageBox').innerHTML = '빈칸 없이 입력해 주세요.';
            document.getElementById('joinMessageBox').classList.remove('noVisible');
            return result;
        }
    }

    return true;
}

/**
 * 회원가입
 */
function join() {
    const userEmail = document.getElementById('joinEmail').value;
    const userPassword = document.getElementById('joinPassword').value;
    const userNickname = document.getElementById('joinNickname').value;
    const user = {userEmail, userPassword, userNickname};

    if (checkUser(user)) {
        axios.post(`/auth/join`, user)
            .then(res => {
                if (res.data.status === '003') {   // 가입 성공
                    location.reload();
                    alert(res.data.message);
                } else {    // 탈퇴한 회원이거나 이미 존재하는 이메일
                    document.getElementById('joinMessageBox').innerHTML = res.data.message;
                    document.getElementById('joinMessageBox').classList.remove('noVisible');
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
}
