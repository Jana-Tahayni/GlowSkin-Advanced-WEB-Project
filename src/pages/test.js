import api from "../services/api";

useEffect(() => {
  api.get("/test")
    .then(res => {
      console.log("API WORKS:", res.data);
    })
    .catch(err => {
      console.log("ERROR:", err);
    });
}, []);