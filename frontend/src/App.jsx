import { Route, Routes } from "react-router";
import Problem from "./Problem";
import ProblemSet from "./ProblemSet";
import Home from "./Home";
import Community from "./Community";
import Contests from "./Contests"
import CreateContest from "./createcontestpage/CreateContest";
import TestingPreview from "./usefulcodes/TestingPreview";
import CreateChallenge from "./createchallengepage/CreateChallenge";
import Login from "./auth/Login";
import SignIn from "./auth/SignIn";
import LogIn from "./auth/Login";
import TestingScroll from "./usefulcodes/TestingScroll";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<ProblemSet />} />
        <Route path="/scroll" element={<TestingScroll />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/contests/create" element={<CreateContest />} />
        <Route path="/community" element={<Community />} />
        <Route path="/problems/:problemId" element={<Problem />} />
        <Route path="/preview" element={<TestingPreview />} />
        <Route path="/challenge/create" element={<CreateChallenge />} />
      </Routes>
    </>
  );
};

export default App;
