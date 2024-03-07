import React, { useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { SiBookstack } from "react-icons/si";
import { LiaFileAudioSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa";

// import { BarChart, Card, Elder } from "../";
import { Col, Container, Row } from "reactstrap";
import { UserData } from "../../data";

const cardItems = [
  {
    id: 1,
    title: "المستخدمين",
    icon: <HiUsers />,
    path: "/users",
    count: 10,
    color: "linear-gradient(45deg, rgb(249, 177, 21), rgb(246, 150, 11))",
  },
  {
    id: 2,
    title: "الكتب",
    icon: <SiBookstack />,
    path: "/books",
    count: 20,
    color: "linear-gradient(45deg, rgb(50, 31, 219), rgb(31, 20, 152))",
  },
  {
    id: 3,
    title: "الصوتيات",
    icon: <LiaFileAudioSolid />,
    path: "/audios",
    count: 30,
    color: "linear-gradient(45deg, rgb(203, 93, 255), rgb(128, 12, 184))",
  },
  {
    id: 4,
    title: "العلماء",
    icon: <FaUser />,
    path: "/elder",
    count: 40,
    color: "linear-gradient(45deg, rgb(51, 153, 255), rgb(41, 130, 204))",
  },
  {
    id: 5,
    title: "المقالات",
    icon: <SiBookstack />,
    path: "/articles",
    count: 50,
    color: "linear-gradient(45deg, rgb(255, 51, 51), rgb(204, 0, 0))",
  },
  {
    id: 6,
    title: "الصور",
    icon: <SiBookstack />,
    path: "/pictures",
    count: 60,
    color: "linear-gradient(45deg, rgb(255, 153, 51), rgb(204, 102, 0))",
  },
  {
    id: 7,
    title: "التحميل",
    icon: <SiBookstack />,
    path: "/downloads",
    count: 70,
    color: "linear-gradient(45deg, rgb(0, 204, 204), rgb(0, 153, 153))",
  },
  {
    id: 8,
    title: "المفضلة",
    icon: <SiBookstack />,
    path: "/favorites",
    count: 80,
    color: "linear-gradient(45deg, rgb(0, 204, 102), rgb(0, 153, 51))",
  },
  {
    id: 9,
    title: "المشاركة",
    icon: <SiBookstack />,
    path: "/shares",
    count: 90,
    color: "linear-gradient(45deg, rgb(255, 204, 51), rgb(204, 153, 0))",
  },
  {
    id: 10,
    title: "المستخدمين المنضمين حديثاً",
    icon: <SiBookstack />,
    path: "/new-users",
    count: 100,
    color: "linear-gradient(45deg, rgb(153, 102, 255), rgb(102, 51, 204))",
  },
  {
    id: 11,
    title: "المستخدمين النشطين",
    icon: <SiBookstack />,
    path: "/active-users",
    count: 110,
    color: "linear-gradient(45deg, rgb(0, 204, 153), rgb(0, 153, 102))",
  },
  {
    id: 12,
    title: "المستخدمين الغير نشطين",
    icon: <SiBookstack />,
    path: "/inactive-users",
    count: 120,
    color: "linear-gradient(45deg, rgb(255, 102, 102), rgb(204, 0, 0))",
  },
  {
    id: 13,
    title: "المستخدمين المحذوفين",
    icon: <SiBookstack />,
    path: "/deleted-users",
    count: 130,
    color: "linear-gradient(45deg, rgb(0, 204, 255), rgb(0, 153, 204))",
  },
];

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = useState({
    labels: UserData.map((item) => item.year),
    datasets: [
      {
        label: "المستخدمين",
        data: UserData.map((item) => item.userGain),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المقالات",
        data: UserData.map((item) => item.articleGain),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المقاطع",
        data: UserData.map((item) => item.audioGain),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "الصور",
        data: UserData.map((item) => item.pictureGain),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "الكتب",
        data: UserData.map((item) => item.bookGain),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "التحميل",
        data: UserData.map((item) => item.downloadGain),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المفضلة",
        data: UserData.map((item) => item.favoriteGain),
        backgroundColor: "rgba(75,45,62,0.2)",
        borderColor: "rgba(45,122,220,1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المشاركة",
        data: UserData.map((item) => item.shareGain),
        backgroundColor: "rgba(75,123,97,0.2)",
        borderColor: "rgba(75,86,45,1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "العلماء",
        data: UserData.map((item) => item.scholarGain),
        backgroundColor: "rgba(75,67,130,0.2)",
        borderColor: "rgba(75,140,67,1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المستخدمين المنضمين حديثاً",
        data: UserData.map((item) => item.newUserGain),
        backgroundColor: "rgba(75,158,192,0.2)",
        borderColor: "rgba(75,242,12,1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المستخدمين النشطين",
        data: UserData.map((item) => item.activeUserGain),
        backgroundColor: "rgba(75,45,37,0.2)",
        borderColor: "rgba(75,97,59,1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المستخدمين الغير نشطين",
        data: UserData.map((item) => item.inactiveUserGain),
        backgroundColor: "rgba(75,44,178,0.2)",
        borderColor: "rgba(75,224,71,1)",
        borderWidth: 1,
        weight: 1,
      },
      {
        label: "المستخدمين المحذوفين",
        data: UserData.map((item) => item.deletedUserGain),
        backgroundColor: "rgba(75,77,241,0.2)",
        borderColor: "rgba(75,146,178,1)",
        borderWidth: 1,
        weight: 1,
      },
    ],
  });

  return (
    <>
      <div className="dashboard-cards mb-3 mt-5 bg-white p-4">
        <Container style={{ minWidth: "100%" }}>
          <Row
            style={{ maxWidth: "100vw" }}
            className="flex-wrap justify-content-between align-items-center g-3"
          >
            {cardItems.map((item) => (
              <Col xl="3" lg="4" md="6" sm="12" key={item.id}>
                <Card item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      {/* <div className="dashboard-charts mb-3 p-4">
        <Row>
          <Col xl="12" className="chart-containerY">
            <div className="chart">
              <BarChart
                chartData={userData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
              ;
            </div>
          </Col>
        </Row>
      </div> */}
      <div className="dashboard-users mb-5 p-4">
        <Row>
          <Col xl="12">
            <Elder dashboard={true} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
