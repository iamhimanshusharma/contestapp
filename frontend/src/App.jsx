import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserEditor from "./UserEditor";
import { Editor } from "@monaco-editor/react";
import { Route, Routes } from "react-router";
import Problem from "./Problem";
import MyMarkdownEditor from "./MyMarkdownEditor";
import TabLayout from "./TabLayout";
import ProblemSet from "./ProblemSet";
import Home from "./Home";
import Community from "./Community";
import Contests from "./Contests"
import Divider from "./Divider";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/markdown" element={<MyMarkdownEditor />} />
        <Route path="/tab" element={<TabLayout />} />
        <Route path="/problems" element={<ProblemSet />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/community" element={<Community />} />
        <Route path="/problems/:problemId" element={<Problem />} />
        <Route path="/divider" element={<Divider />} />
      </Routes>
    </>
  );
};

export default App;
