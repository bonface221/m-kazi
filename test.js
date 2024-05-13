let url = "http://localhost:3001/api/create-order/";

(function apiTEST() {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "test",
      email: "",
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
})();
