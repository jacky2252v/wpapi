import { useState } from "react";
import axios from "axios";

function Hero() {
  const [number, setNumber] = useState();

  const header = {
    Headers: {
      Authorization: `Bearer EAAWG5CZCwRykBOZBinxNQZAvToRxNwdZBXKXudabMMigKsSPXSAd1dcPZAdvpJA10U4iVfnPdChYlEeSZBlRVxfZAYNdyenpbikMv1Q4tYGIXXTMy7b3KDaJwfyOKZALAJX4CTZBBn1M7uLBtGVddDvShvh6O4rb8RWT14TD6QZA2gcC4HKpR12CkzHpN2LIGHznZBnOVZCcNIxF2sE4KikZD`,
      accept: "application/json",
    },
  };

  const sendMsg = () => {
    console.log("Number is ", number);

    const body = {
      messaging_product: "whatsapp",
      to: "91" + number,
      type: "template",
      template: { name: "hello_world", language: { code: "en_US" } },
    };

    axios
      .post(
        "http://graph.facebook.com/v19.0/352144941317379/messages",
        body,
        header
      )
      .then((res) => console.log("Message send succesfully", res))
      .catch((err) => console.log("Error while sending", err));
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
