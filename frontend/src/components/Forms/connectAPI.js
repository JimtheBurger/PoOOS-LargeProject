//Connects form values to API and returns server reply as a parsed JSON object.
//Input a raw object (this function will stringify it) and string api destination (/api/ included)
export async function connectAPI(obj, destination) {
  //Our app name on heroku
  const app_name = "cop4331-g4-ed21fec8c26b";

  function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
      return "https://" + app_name + ".herokuapp.com/api/" + route;
    } else {
      return "http://localhost:5000/api/" + route;
    }
  }

  var js = JSON.stringify(obj);

  try {
    const response = await fetch(buildPath(destination), {
      method: "POST",
      body: js,
      headers: { "Content-Type": "application/json" },
    });

    var res = JSON.parse(await response.text());

    return res;
  } catch (e) {
    console.log("Connection Error for API " + destination);
    return;
  }
}
