import React from "react";
import { Outlet } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const LoginHome = () => {
  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center" style={{ minHeight: "100vh" }}>
          <Col
            xl="6"
            lg="8"
            md="10"
            className="d-flex justify-content-center align-items-center"
          >
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginHome;
