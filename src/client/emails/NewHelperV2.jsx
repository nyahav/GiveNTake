import { Body, Button, Column, Container, Head, Heading, Html, Img, Link, Preview, Row, Section, Text, Tailwind } from "@react-email/components";
import { max, min } from "date-fns";
import React from "react";


/*const baseUrl = process.env.VITE_BASE_URL?
    `https://${process.env.GIVENTAKE_URL}`
    : "";
const baseUrl = process.env.GIVENTAKE_URL
  ? `https://${process.env.GIVENTAKE_URL}`
  : "";*/

const baseUrl = "https://giventake.org";

const GiventakeWelcomeEmail = ({ name, nameOfHelper }) => {

  return (
    <Html>
      <Head />
      <Preview>You received an offer of help</Preview>
      <Body style={main}>
        <section style={header}>
          <Img
            src="https://onedrive.live.com/embed?resid=B8BC9B049BB1AE95%215590&authkey=%21AFj_phHaUAj2iTc&width=846&height=196"
            alt="Given'take logo"
            style={imgHeader}
          />
        </section>
        <Container style={container}>
          <Heading style={title}>
            <h2>Hi {name}, 1 new message awaits your response</h2>

          </Heading>
          <Section>
            <Img
              src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
              alt="profile picture"
              style={imgProfile}
            />
            <Text style={bodyText}>
              <strong>{nameOfHelper} </strong> sent you a message offering help <br />
              Check your messages to see the details
            </Text>
          </Section>
          <Section style={buttonContainer}>
            <Button>
              <Link style={button} href={`${baseUrl}/messages`}>View messages</Link>
            </Button>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              Best,
              <br />
              Given'take team
            </Text>
          </Section>
          <section >
            {/* <Img
              src="https://onedrive.live.com/embed?resid=B8BC9B049BB1AE95%215591&authkey=%21AHOpi78OvmJEL3g&width=1037&height=691"
              alt="Given'take logo"
              style={imgBody}
            />
            <Text><strong>"Only a life lived for others is a life worthwhile."
              Albert Einstein</strong></Text>*/}
          </section>
        </Container>
      </Body>

    </Html>
  );
};

GiventakeWelcomeEmail.PreviewProps = {
  name: "Ivan",
  nameOfHelper: "John",
}

export default GiventakeWelcomeEmail;


const main = {
  fontFamily: '"Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
  backgroundColor: "#fff",
  margin: "0",
  padding: "10px",
};

const imgBody = {
  margin: "auto",
  maxWidth: "100%",
  width: "640px",
};

const imgHeader = {
  margin: "auto",
  maxWidth: "100%",
  width: "300px",
};

const imgProfile = {
  borderRadius: "50%",
  width: "100px",
  height: "100px",
  margin: "0 auto",
};

const header = {
  width: "100%",
  backgroundColor: "#fff",
  margin: "0 auto",
  zIndex: "999",
  textAlign: "left",
  maxWidth: "550px",

};

const container = {
  margin: "0 auto",
  width: "648px",
  maxWidth: "100%",
  textAlign: "center",
  padding: "10px",
};


const title = {
  fontSize: "30px",
  margin: "10px 0 0 0",
}

const footer = {
  textAlign: "left",

  maxWidth: "550px",
};

const buttonContainer = {
  textAlign: "center",
  width: "100%",
  margin: "20px 0",
};


const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "50px",
  color: "#fff",
  fontSize: "18px",
  textDecoration: "none",
  textAlign: "center",
  padding: "12px",
  textAlign: "center",
};

const bodyText = {
  fontSize: "18px",
  lineHeight: "1.5",
}

const footerText = {
  fontSize: "17px",
}
