const Dashboard = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }

  return <h2>Welcome to your Dashboard!</h2>;
};

export default Dashboard;
