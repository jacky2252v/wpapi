import { useState } from "react";
import axios from "axios";

function Hero() {
  const [number, setNumber] = useState();
  const [token, setToken] = useState();

  const header = {
    Authorization: `Bearer EAAMNykEQLmoBOZCkSCi1ZCSe2afefDeUiSEWDTZB5s27VPyizn2YVJlNVvrPUZAYy5qZBBSQ7zCzH4KmmBZC7jE1SDWfaPWL7Osfv0ONGZCHp4YZCZAGCkvXVgCnmc9FYYZCCeFQlSyvzoTqWVgHyJZAFNFxUBhAKI3jyZApZAFkDug0ebSBKlgw6PjWZAMwidAGKj`,
    "Content-Type": "application/json",
  };
  axios.create({
    debug: true,
  });
  const sendMsg = () => {
    console.log("Number is ", number);
    console.log("Token is ", token);

    const body = {
      messaging_product: "whatsapp",
      // to: "91" + number,
      to: `91${number}`,
      type: "template",
      template: {
        name: token,
        language: { code: "en_US" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  link: "https://my.alfred.edu/zoom/_images/foster-lake.jpg",
                },
              },
            ],
          },
        ],
      },
    };

    axios
      ?.post(
        "https://graph.facebook.com/v19.0/352144941317379/messages",
        body,
        {
          headers: header,
        }
      )
      ?.then((res) => console.log("Message send succesfully", res))
      ?.catch((err) => console.log("Error while sending", err));
  };

  return (
    <>
      <h1>Whatsapp API</h1>
      <div className="box">
        <h3>PhoneNumber</h3>
        <input
          type="text"
          onChange={(e) => setNumber(e.target.value)}
          style={{
            padding: "8px 20px",
            border: "2px solid ",
            borderRadius: "2px",
            background: "transparent",
            color: "white",
          }}
        />
        <br />
        <br />
        {/* <input
          type="text"
          onChange={(e) => setToken(e.target.value)}
          style={{
            padding: "8px 20px",
            border: "2px solid ",
            borderRadius: "2px",
            background: "transparent",
            color: "white",
          }}
        /> */}
        <h2>Select Template</h2>
        <select
          onChange={(e) => setToken(e.target.value)}
          name=""
          id=""
          style={{
            padding: "8px 20px",
            border: "2px solid ",
            borderRadius: "2px",
            background: "transparent",
            color: "white",
          }}
        >
          <option
            value="hello_world"
            style={{
              color: "black",
            }}
          >
            hello_world
          </option>
          <option
            value="whap_test"
            style={{
              color: "black",
            }}
          >
            whap_test
          </option>
        </select>
      </div>
      <br />
      <div className="btn">
        <button
          onClick={sendMsg}
          style={{
            backgroundColor: "green",
            border: "2px solid black",
            margin: "5px",
          }}
        >
          Send Message
        </button>
      </div>
    </>
  );
}

export default Hero;
