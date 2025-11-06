import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserEditor from "./UserEditor";
import { Editor } from "@monaco-editor/react";
import { Route, Routes } from "react-router";
import Problem from "./Problem";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/problem" element={<Problem />} />
      </Routes>
    </>
  );
};

export default App;
