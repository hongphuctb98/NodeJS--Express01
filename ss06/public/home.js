let tbody = document.querySelector("#tbody");
let form = document.querySelector("#create-form");
let createBtn = document.querySelector(".create-btn");
let updateBtn = document.querySelector(".update-btn");

const baseUrl = "http://localhost:3000/api/v1/users";
fetch(baseUrl)
  .then((res) => res.json())
  .then((data) => {
    let { users } = data;
    users.forEach((element, i) => {
      tbody.innerHTML += ` <tr>
      <th scope="row">${i}</th>
      <td>${element.id}</td>
      <td>${element.email}</td>
      <td>${element.password}</td>
      <td>
        <button class="btn btn-success" onclick="updateAction(${element.id})">Update</button>
        <button class="btn btn-danger"  onclick="deleteAction(${element.id})">Delete</button>
      </td>
    </tr>`;
    });
  })
  .catch((err) => console.log(err));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let user = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    let res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    let data = await res.json();
    console.log(data);
    tbody.innerHTML += ` <tr>
    <th scope="row">${tbody.children.length}</th>
    <td>${data.user.id}</td>
    <td>${data.user.email}</td>
    <td>${data.user.password}</td>
    <td>
      <button class="btn btn-success" onclick="updateAction(${element.id})" >Update</button>
      <button class="btn btn-danger " onclick="deleteAction(${element.id})">Delete</button>
    </td>
  </tr>`;
  } catch (error) {
    console.log(error);
  }
});

let currentCheckUser = "";
function changeBtn() {
  if (currentCheckUser !== "") {
    createBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
  } else {
    createBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
  }
}
changeBtn();

async function updateAction(id) {
  let res = await fetch(`http://localhost:3000/api/v1/users/${id}`);
  let data = await res.json();
  currentCheckUser = data;
  console.log(data);
  form.email.value = data.user.email;
  form.password.value = data.user.password;
  changeBtn();
}

updateBtn.addEventListener("click", async () => {
  const user = {
    email: form.email.value,
    password: form.password.value,
  };

  console.log(currentCheckUser.user.id);
  let res = await fetch(
    `http://localhost:3000/api/v1/users/${currentCheckUser.user.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }
  );
  let data = await res.json();
  tbody.innerHTML = "";
  data.users.forEach((element, i) => {
    tbody.innerHTML += ` <tr>
    <th scope="row">${i}</th>
    <td>${element.id}</td>
    <td>${element.email}</td>
    <td>${element.password}</td>
    <td>
      <button class="btn btn-success" onclick="updateAction(${element.id})" >Update</button>
      <button class="btn btn-danger " onclick="deleteAction(${element.id})">Delete</button>
    </td>
  </tr>`;
  });
  currentCheckUser = "";
  changeBtn();
});

async function deleteAction(id) {
  console.log(id);
  let res = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
    method: "DELETE",
  });

  let data = await res.json();
  console.log(data);
  tbody.innerHTML = "";
  data.users.forEach((element, i) => {
    tbody.innerHTML += ` <tr>
    <th scope="row">${i}</th>
    <td>${element.id}</td>
    <td>${element.email}</td>
    <td>${element.password}</td>
    <td>
      <button class="btn btn-success" onclick="updateAction(${element.id})" >Update</button>
      <button class="btn btn-danger " onclick="deleteAction(${element.id})">Delete</button>
    </td>
  </tr>`;
  });
}
