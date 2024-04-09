import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "reactstrap";
import { HiUsers } from "react-icons/hi2";
import { SiGooglescholar } from "react-icons/si";
import { LiaFileAudioSolid } from "react-icons/lia";
import { GrFavorite } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { GiBookshelf } from "react-icons/gi";
import { SlPicture } from "react-icons/sl";
import { MdArticle } from "react-icons/md";
import { IoCloudDownloadSharp } from "react-icons/io5";
import { Card, MostListening, NewUsers } from "../";
import { useDispatch, useSelector } from "react-redux";
import { getCounts } from "../../store/slices/dashboardSlice";
// import { UserData } from "../../data";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { counts, loading } = useSelector((state) => state.dashboard);
  const cardItems = [
    {
      id: 1,
      title: t("dashboard.users"),
      icon: <HiUsers />,
      path: "users",
      disabled: false,
      count: counts?.User_Count,
      color: "linear-gradient(45deg, rgb(249, 177, 21), rgb(246, 150, 11))",
    },
    {
      id: 2,
      title: t("dashboard.elders"),
      icon: <SiGooglescholar />,
      path: "elder",
      disabled: false,
      count: counts?.Elder_Count,
      color: "linear-gradient(45deg, rgb(51, 153, 255), rgb(41, 130, 204))",
    },
    {
      id: 3,
      title: t("dashboard.books"),
      icon: <GiBookshelf />,
      path: "books",
      disabled: false,
      count: counts?.Book_Count,
      color: "linear-gradient(45deg, rgb(50, 31, 219), rgb(31, 20, 152))",
    },
    {
      id: 4,
      title: t("dashboard.audios"),
      icon: <LiaFileAudioSolid />,
      path: "audios",
      disabled: false,
      count: counts?.Audio_Count,
      color: "linear-gradient(45deg, rgb(203, 93, 255), rgb(128, 12, 184))",
    },
    {
      id: 5,
      title: t("dashboard.images"),
      icon: <SlPicture />,
      path: "images",
      disabled: false,
      count: counts?.Image_Count,
      color: "linear-gradient(45deg, rgb(233 30 99), rgb(156 39 176))",
    },
    {
      id: 6,
      title: t("dashboard.articles"),
      icon: <MdArticle />,
      path: "articles",
      disabled: false,
      count: counts?.Articles_Count,
      color: "linear-gradient(45deg, rgb(255, 51, 51), rgb(204, 0, 0))",
    },
    {
      id: 7,
      title: t("dashboard.downloads"),
      icon: <IoCloudDownloadSharp />,
      path: "downloads",
      disabled: true,
      count: counts?.total_download_count_Count,
      color: "linear-gradient(45deg, rgb(0, 204, 204), rgb(0, 153, 153))",
    },
    {
      id: 8,
      title: t("dashboard.favorites"),
      icon: <GrFavorite />,
      path: "favorites",
      disabled: true,
      count: counts?.total_favorite_count_Count,
      color: "linear-gradient(45deg, rgb(0, 204, 102), rgb(0, 153, 51))",
    },
    // {
    //   id: 9,
    //   title: t("dashboard.mostListening"),
    //   icon: <LiaFileAudioSolid />,
    //   path: "most-listening",
    // disabled: false,
    //   count: counts?.most_listening_count_Count,
    //   color: "linear-gradient(45deg, rgb(255, 204, 51), rgb(204, 153, 0))",
    // },
    // {
    //   id: 10,
    //   title: t("dashboard.newUsers"),
    //   icon: <HiUsers />,
    //   path: "new-users",
    //   disabled: false,
    //   count: counts?.new_user_count_Count,
    //   color: "linear-gradient(45deg, rgb(153, 102, 255), rgb(102, 51, 204))",
    // },
  ];
  // // eslint-disable-next-line no-unused-vars
  // const [userData, setUserData] = useState({
  //   labels: UserData.map((item) => item.year),
  //   datasets: [
  //     {
  //       label: t("dashboard.users"),
  //       data: UserData.map((item) => item.userGain),
  //       backgroundColor: "rgba(75,192,192,0.2)",
  //       borderColor: "rgba(75,192,192,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.articles"),
  //       data: UserData.map((item) => item.articleGain),
  //       backgroundColor: "rgba(255, 206, 86, 0.2)",
  //       borderColor: "rgba(255, 206, 86, 1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.audios"),
  //       data: UserData.map((item) => item.audioGain),
  //       backgroundColor: "rgba(54, 162, 235, 0.2)",
  //       borderColor: "rgba(54, 162, 235, 1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.images"),
  //       data: UserData.map((item) => item.pictureGain),
  //       backgroundColor: "rgba(153, 102, 255, 0.2)",
  //       borderColor: "rgba(153, 102, 255, 1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.books"),
  //       data: UserData.map((item) => item.bookGain),
  //       backgroundColor: "rgba(255, 99, 132, 0.2)",
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.downloads"),
  //       data: UserData.map((item) => item.downloadGain),
  //       backgroundColor: "rgba(255, 159, 64, 0.2)",
  //       borderColor: "rgba(255, 159, 64, 1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.favorites"),
  //       data: UserData.map((item) => item.favoriteGain),
  //       backgroundColor: "rgba(75,45,62,0.2)",
  //       borderColor: "rgba(45,122,220,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.shares"),
  //       data: UserData.map((item) => item.shareGain),
  //       backgroundColor: "rgba(75,123,97,0.2)",
  //       borderColor: "rgba(75,86,45,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.elders"),
  //       data: UserData.map((item) => item.scholarGain),
  //       backgroundColor: "rgba(75,67,130,0.2)",
  //       borderColor: "rgba(75,140,67,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.newUsers"),
  //       data: UserData.map((item) => item.newUserGain),
  //       backgroundColor: "rgba(75,158,192,0.2)",
  //       borderColor: "rgba(75,242,12,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.activeUsers"),
  //       data: UserData.map((item) => item.activeUserGain),
  //       backgroundColor: "rgba(75,45,37,0.2)",
  //       borderColor: "rgba(75,97,59,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.inactiveUsers"),
  //       data: UserData.map((item) => item.inactiveUserGain),
  //       backgroundColor: "rgba(75,44,178,0.2)",
  //       borderColor: "rgba(75,224,71,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //     {
  //       label: t("dashboard.deletedUsers"),
  //       data: UserData.map((item) => item.deletedUserGain),
  //       backgroundColor: "rgba(75,77,241,0.2)",
  //       borderColor: "rgba(75,146,178,1)",
  //       borderWidth: 1,
  //       weight: 1,
  //     },
  //   ],
  // });

  useEffect(() => {
    try {
      dispatch(getCounts());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <>
      <div className="dashboard-cards mb-3 mt-5 bg-white p-4">
        <Container style={{ minWidth: "100%" }}>
          <Row
            style={{ maxWidth: "100vw" }}
            className={`${loading ? "justify-content-center mt-5" : "flex-wrap flex-row-reverse justify-content-start align-items-center g-3"}`}
          >
            {loading ? (
              <Spinner
                color="primary"
                style={{
                  height: "3rem",
                  width: "3rem",
                }}
              >
                Loading...
              </Spinner>
            ) : (
              cardItems.map((item) => (
                <Col xl="3" lg="4" md="6" sm="12" key={item.id}>
                  <Card item={item} />
                </Col>
              ))
            )}
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
            <NewUsers dashboard={true} />
          </Col>
          <Col xl="12">
            <MostListening dashboard={true} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
