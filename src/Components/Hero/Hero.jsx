import { useState } from "react";
import axios from "axios";

function Hero() {
  const [number, setNumber] = useState();

  const header = {
    Authorization: `Bearer EAAMNykEQLmoBOxnzOu19b7byS0sjUz77P4f6cZCJloxKcxtJR4QSxOGttZA21rF3JjDvL4T5eHG7ROx7mAZCX0spukNzv0mxfnu5G7B1MS3ly49GyTA6BhuZC0qKKQlz4DBks79Y1z8mMveB1eVaax2Q5hZBYkDMBnuwh0BiMehwuZBDOkCOZBd26qFtQQe`,
    "Content-Type": "application/json",
  };
  axios.create({
    debug: true,
  });
  const sendMsg = () => {
    console.log("Number is ", number);

    const body = {
      messaging_product: "whatsapp",
      to: "91" + number,
      type: "template",
      template: { name: "testonly", language: { code: "en" } },
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
      </div>
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
