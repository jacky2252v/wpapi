import { useState } from "react";
import axios from "axios";

function Home() {
  const [number, setNumber] = useState("");
  const [template, setTemplate] = useState("hello_world");
  const [templates, setTemplates] = useState([
    { name: "hello_world", language: "en_US" },
    { name: "test2", language: "en_US" },
    // { name: "custom_template", language: "fr_FR" },
  ]);

  const header = {
    Authorization: `Bearer EAAMNykEQLmoBOZCkSCi1ZCSe2afefDeUiSEWDTZB5s27VPyizn2YVJlNVvrPUZAYy5qZBBSQ7zCzH4KmmBZC7jE1SDWfaPWL7Osfv0ONGZCHp4YZCZAGCkvXVgCnmc9FYYZCCeFQlSyvzoTqWVgHyJZAFNFxUBhAKI3jyZApZAFkDug0ebSBKlgw6PjWZAMwidAGKj`,
    "Content-Type": "application/json",
  };

  const sendMsg = () => {
    if (!number) {
      alert("Please enter a phone number");
      return;
    }

    const body = {
      messaging_product: "whatsapp",
      to: `+91${number}`,
      type: "template",
      template: {
        name: template,
        language: { code: templates.find((t) => t.name === template).language },
        components: [
          {
            type: "header",
            parameters: [{ type: "text", text: "Vivek" }],
          },
          {
            type: "body",
            parameters: [{ type: "text", text: "Vivek" }],
          },
        ],
      },
    };

    axios
      .post("https://graph.facebook.com/v19.0/352144941317379/messages", body, {
        headers: header,
      })
      .then((res) => {
        console.log("Message sent successfully", res);
        alert("Message sent successfully!");
      })
      .catch((err) => {
        console.error("Error while sending", err);
        alert("Error sending message. Please try again.");
      });
  };

  return (
    <>
      <h1>Whatsapp API</h1>
      <div className="box">
        <h3>PhoneNumber</h3>
        <input
          type="text"
          value={number}
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

        <h3>Template:</h3>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          {templates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.name}
            </option>
          ))}
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

export default Home;
