const axios = require("axios");
setInterval(() => {
  axios({
    url: "http://localhost:4000/query",
    method: "post",
    data: { query: `query {dogs {name}}` },
  })
    .then((result) => {
      console.log(result.data);
      statusUpdate();
    })
    .catch((err) => {
        console.log(err);
        badStatus()
    }
    );
}, 5000);

const fetch = require("node-fetch");

const statusUpdate = () => {
  fetch(`http://localhost:8080/v1alpha1/graphql`, {
    method: "POST",
    headers: {
      "x-hasura-admin-secret": "mylongsecretkey",
    },
    body: JSON.stringify({
      query: `
          mutation {
            insert_status (
              objects: [{
                status: 200
              }]
            ) {
              returning {
                recorded_at
                status
              }
            }
          }
          `,
    }),
  }).then((resp) =>
    resp.json().then((respObj) => console.log(JSON.stringify(respObj, null, 2)))
  );
};

const badStatus = () => {
    fetch(`http://localhost:8080/v1alpha1/graphql`, {
      method: "POST",
      headers: {
        "x-hasura-admin-secret": "mylongsecretkey",
      },
      body: JSON.stringify({
        query: `
            mutation {
              insert_status (
                objects: [{
                  status: 400
                }]
              ) {
                returning {
                  recorded_at
                  status
                }
              }
            }
            `,
      }),
    }).then((resp) =>
      resp.json().then((respObj) => console.log(JSON.stringify(respObj, null, 2)))
    );
  };
  