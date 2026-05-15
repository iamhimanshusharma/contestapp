import { Route, Routes } from "react-router-dom";
import IDE from "./IDE";
import Problem from "./Problem";
import Home from "./Home";
import Community from "./Community";
import Contests from "./Contests"
import CreateContest from "./createcontestpage/CreateContest";
import CreateChallenge from "./createchallengepage/CreateChallenge";
import SignIn from "./auth/SignIn";
import LogIn from "./auth/LogIn";
import ContestDetail from "./ContestDetail";
import ContestResults from "./ContestResults";
import Profile from "./Profile";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problem />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/contests/create" element={<CreateContest />} />
        <Route path="/contests/:contestId" element={<ContestDetail />} />
        <Route path="/contests/:contestId/results" element={<ContestResults />} />
        <Route path="/contests/:contestId/problems/:problemId" element={<IDE />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/problems/:problemId" element={<IDE />} />
        <Route path="/challenge/create" element={<CreateChallenge />} />
      </Routes>
    </>
  );
};

export default App;
