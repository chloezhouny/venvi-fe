import axios from "axios";

// export default axios.create({
//   baseURL: "https://cors-anywhere.herokuapp.com/https://venvi-be.herokuapp.com/",
//   responseType: "json"
// });


export default axios.create({
  baseURL: "http://localhost:3001",
  responseType: "json"
});