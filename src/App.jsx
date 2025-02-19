import React, { useEffect, useState } from "react";
import Home from "./components/HomePage/Home";
import Signup from "./components/Account/Signup";
import Login from "./components/Account/Login";
import Questions from "./components/Questions/Questions";
import Question from "./components/Questions/Question";
import Verification from "./components/Account/Verification";
import Competitions from "./components/Competition/Competitions";
import Competition from "./components/Competition/Competition";
import ProgressBar from "./ProgressBar";
import Layout from "./components/Questions/Layout";
import Submissions from "./components/Questions/Submissions";
import QuizAdmin from "./components/Admin/QuizAdmin";
import QuizCreate from "./components/Admin/QuizCreate";
import QuizDetails from "./components/Admin/QuizDetails";
import Quizzes from "./components/Quiz/Quizzes";
import Quiz from "./components/Quiz/Quiz";
import Results from "./components/Quiz/Results";
import StudentResults from "./components/Admin/StudentResults";
import QuestionAnalysis from "./components/Admin/QuestionAnalysis";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashBoard from "./components/Admin/AdminDashboard";
import ProfileLayout from "./components/Profile/ProfileLayout";
import Profile from "./components/Profile/Profile";
import Info from "./components/Profile/Info";
import Change from "./components/Profile/Change";
import CompNQuestion from "./components/Admin/CompNQuestion";
import CompNQuestionDetails from "./components/Admin/CompNQuestionDetails";
import CreateCompNQuestion from "./components/Admin/CreateCompNQuestion";
import CompNQuestionStudentResults from "./components/Admin/CompNQuestionStudentResults";
import CreateUpdates from "./components/Admin/CreateUpdates";
import DeleteAccount from "./components/Account/DeleteAccount";
import VerifyDelete from "./components/Account/VerifyDelete";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [code, setCode] = useState("");
  const [lastKeypress, setLastKeypress] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" || e.key === "C" || e.key === "J")
      ) {
        if (prompt("Enter developer password") != "hello world") {
          alert("Wrong password.");
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const E404 = () => {
    return <h1>This page does not exist.</h1>;
  };

  return (
    <BrowserRouter>
      <div>
        <ProgressBar />
        <Routes>
          <Route path="*" element={<E404 />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/signup/verification/:verification"
            element={<Verification />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/delete" element={<DeleteAccount />} />
          <Route path="/delete/verification/:verification" element={<VerifyDelete />} />
          <Route path="/question">
            <Route index element={<Questions />} />
            <Route
              path=":qid"
              element={
                <Layout
                  code={code}
                  setCode={setCode}
                  setLastKeypress={setLastKeypress}
                  setSaved={setSaved}
                  children={
                    <Question
                      code={code}
                      setCode={setCode}
                      setLastKeypress={setLastKeypress}
                      setSaved={setSaved}
                      lastKeypress={lastKeypress}
                      saved={saved}
                    />
                  }
                />
              }
            />
            <Route
              path=":qid/submissions"
              element={<Layout setCode={setCode} code={code} children={<Submissions code={code}  />} />}
            />
          </Route>
          <Route path="/competition" element={<Competitions />} />
          <Route path="/competition/:compid" element={<Competition />} />
          <Route path="/admin">
            <Route index element={<AdminDashBoard />} />
            <Route path="login" element={<AdminLogin />} />
            <Route path="updates" element={<CreateUpdates />} />
            <Route path="quiz">
              <Route index element={<QuizAdmin />} />
              <Route path="create" element={<QuizCreate />} />
              <Route path="details/:id">
                <Route index element={<QuizDetails />} />
                <Route path=":email/" element={<StudentResults />} />
              </Route>
              <Route path="question/:id" element={<QuestionAnalysis />} />
            </Route>
            <Route path="questions-competitions">
              <Route index element={<CompNQuestion />} />
              <Route path="create" element={<CreateCompNQuestion />} />
              <Route path="details/:type/:id">
                <Route index element={<CompNQuestionDetails />} />
                <Route
                  path=":email/"
                  element={<CompNQuestionStudentResults />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="/quiz">
            <Route index element={<Quizzes />} />
            <Route path=":id" element={<Quiz />} />
            <Route path=":id/results" element={<Results />} />
          </Route>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path="information" element={<Info />} />
            <Route path="information/change" element={<Change />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
