import { Body, Button, Column, Container, Head, Heading, Html, Img, Link, Preview, Row, Section, Text, Tailwind } from "@react-email/components";
import React from "react";


/*const baseUrl = process.env.VITE_BASE_URL?
    `https://${process.env.GIVENTAKE_URL}`
    : "";
const baseUrl = process.env.GIVENTAKE_URL
  ? `https://${process.env.GIVENTAKE_URL}`
  : "";*/

const baseUrl = "https://giventake.org";

const EmailVerification = ({code}) => {

  return (
    <Html>
      <Head />
      <Preview>Email Verification</Preview>
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
                    <h2>Verify your email address </h2>
                </Heading>
                <Section> 
                    <Text style= {bodyText}>
                        Thanks for starting the account creation process.
                           We want to make sure it's really you. Please enter the following verification code when prompted.
                            If you don't want to create an account, you can ignore this message.
                    </Text>
                </Section>
                <Section style={verificationContainer}>
                    <Text style={verifyText}>Verification code</Text>
                    <Text style = {codeText}>
                        {code}
                    </Text>
                </Section>
                <Section style={footer}>
                    <Text style= {footerText}>
                            Best,
                            <br />
                            Given'take team
                    </Text>
                </Section>
                <section >
                    <Img
                        src="https://onedrive.live.com/embed?resid=B8BC9B049BB1AE95%215591&authkey=%21AHOpi78OvmJEL3g&width=1037&height=691"
                        alt="Given'take logo"
                        style={imgBody}
                    />  
                    <Text><strong>"Only a life lived for others is a life worthwhile."
                        Albert Einstein</strong></Text>
                </section>
            </Container>
        </Body>

    </Html>
  );
};

EmailVerification.PreviewProps = {
  code: "123456",
}


export default EmailVerification;


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
    width: "640px",
    
  };
  
  const header = {
    width: "100%",
    backgroundColor: "#fff",
    margin: "0 auto",
    zIndex: "999",
  };
  
  const container = {
    margin: "0 auto",
    width: "648px",
    maxWidth: "100%",
    textAlign: "left",
  };

  const title = {
    fontSize: "30px",
    margin: "10px 0 0 0",
  }

  const footer = {
    textAlign: "left",
    
  };

  const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "20px",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "12px",
  };
  
  const bodyText = { 
    fontSize: "18px",
    lineHeight: "1.5",
  }

  const footerText = {
    fontSize: "17px",
  }

  const codeText = {
    fontWeight: "bold",
    fontSize: "36px",
    margin: "10px 0",
    textAlign: "center"
  }

  const verifyText = {
    margin: 0,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "20px",
  }
  
  const verificationContainer = {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "5px",
    margin: "20px 0",
  }