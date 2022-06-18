/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-undef */
const regButton = document.getElementById('registrationBtn');
// const loginButton = document.getElementById('loginBtn');

const login = function () {
  JsLoadingOverlay.show();
  const usernameInput = document.getElementById('username').value;
  const passwordInput = document.getElementById('password').value;
  const loginData = {
    username: usernameInput,
    password: passwordInput,
  };
  console.log(loginData);
  axios
    .post('login', loginData)
    .then((response) => {
      JsLoadingOverlay.hide();
      if (response.data.errors === undefined) {
        message.innerHTML = 'Login successful!';
        document.getElementById('username').remove();
        document.getElementById('password').remove();
        document.getElementById('usernameLabel').remove();
        document.getElementById('passwordLabel').remove();
        document.getElementById('loginBtn').remove();
        document.getElementById('headerTitle').innerHTML = 'Welcome To Hangman';
      }
    });
};

const registration = function () {
  JsLoadingOverlay.show();
  const usernameInput = document.getElementById('username').value;
  const emailInput = document.getElementById('email').value;
  const passwordInput = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const message = document.getElementById('message');
  message.innerHTML = '';
  const newData = { username: usernameInput, email: emailInput, password: passwordInput };
  console.log(newData);
  if (usernameInput === '' || emailInput === '' || passwordInput === '' || confirmPassword === '') {
    message.innerHTML = 'Required field cannot be empty!';
  }
  else if (passwordInput !== confirmPassword) {
    message.innerHTML = 'Passwords do not match!';
  }
  else if (passwordInput === confirmPassword) {
    console.log('Password matches!');
    axios
      .post('/register', newData)
      .then((response) => {
        JsLoadingOverlay.hide();
        if (response.data.errors === undefined) {
          message.innerHTML = 'Registration successful!';
          document.getElementById('email').remove();
          document.getElementById('confirmPassword').remove();
          document.getElementById('emailLabel').remove();
          document.getElementById('confirmPasswordLabel').remove();
          document.getElementById('headerTitle').innerHTML = 'Login';
          document.getElementById('title').innerHTML = 'Hangman Login';
          regButton.id = 'loginBtn';
          regButton.innerHTML = 'Login';
          regButton.addEventListener('click', login);
        }
        else if (response.data.errors[0].message === 'users.username cannot be null') {
          message.innerHTML = 'Username cannot be empty!';
        }
        else if (response.data.errors[0].message === 'username already in use') {
          message.innerHTML = 'Username already exists!';
        }
        else if (response.data.errors[0].message === 'valid email-id required') {
          message.innerHTML = 'Please enter a valid email address!';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

// loginButton.addEventListener('click', login);
regButton.addEventListener('click', registration);
