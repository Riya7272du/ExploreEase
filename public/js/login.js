// const showAlert = (type, msg) => {
//   hideAlert();
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
//   window.setTimeout(hideAlert, 5000);
// };

// const loginForm = document.querySelector(".form--login");
// const logoutBtn = document.querySelector(".nav__el--logout");

// if (loginForm) {
//   loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     // console.log(email,password)
//     login(email, password);
//   });
// }

// const hideAlert = () => {
//   const el = document.querySelector(".alert");
//   if (el) el.parentElement.removeChild(el);
// };

// export const login = async (email, password) => {
//   try {
//     const res = await axios({
//       method: "POST",
//       url: "http://127.0.0.1:3000/api/v1/users/login",
//       data: {
//         email,
//         password,
//       },
//     });
//     console.log(res);
//     if (res.data.status === "success") {
//       showAlert("success", "Logged in successfully!");
//       window.setTimeout(() => {
//         location.assign("/");
//       }, 1500);
//     }
//   } catch (err) {
//     console.log(err);
//     showAlert("error", err.response.data.message);
//   }
// };

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: "GET",
//       url: "http://127.0.0.1:3000/api/v1/users/logout",
//     });
//     if (res.data.status === "success") location.reload(true);
//   } catch (err) {
//     showAlert("error", "Error logging out! Try again.");
//   }
// };

// if (logoutBtn) {
//   logoutBtn.addEventListener("click", logout);
// }

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    console.log(res);
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
    });
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}
