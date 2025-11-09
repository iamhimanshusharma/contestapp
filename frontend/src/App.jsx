import { Route, Routes } from "react-router";
import Problem from "./Problem";
import ProblemSet from "./ProblemSet";
import Home from "./Home";
import Community from "./Community";
import Contests from "./Contests"
import CreateContest from "./CreateContest";
import TestingPreview from "./TestingPreview";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<ProblemSet />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/contests/create" element={<CreateContest />} />
        <Route path="/community" element={<Community />} />
        <Route path="/problems/:problemId" element={<Problem />} />
        <Route path="/preview" element={<TestingPreview />} />
      </Routes>
    </>
  );
};

export default App;
