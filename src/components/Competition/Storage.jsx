import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useCookies } from "react-cookie";
import "./coding.css";

const Coding = () => {
  const { compid } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(null);
  const [codeStorage, setCodeStorage] = useState("");
  const [code, setCode] = useState("");
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [executed, setExecuted] = useState({});
  const [tokens, setTokens] = useState({});
  const [results, setResults] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [lastKeypress, setLastKeypress] = useState(null);
  const [timeSinceLastKeypress, setTimeSinceLastKeypress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [submission, setSubmission] = useState(false);
  const [time, setTime] = useState(0);
  const [memory, setMemory] = useState(0);
  const [question, setQuestion] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleFullscreen = () => {
    if (!isFullscreen && !disabled) {
      document.body
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((error) => {
          console.error(`Error entering fullscreen: ${error}`);
        });
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      setIsFullscreen(document.fullscreenElement !== null);
    });
  }, []);

  useEffect(() => {
    if (isFullscreen === false && disabled === false && submission === false) {
      setDisabled(true);
      alert("You are disqualified");
      let formdata = new FormData();
      formdata.append("session_code", compid);
      formdata.append("email", cookies.email);
      formdata.append("code", code);
      formdata.append("barred", true);
      axios.post("http://127.0.0.1:8000/competition/code/submit/", formdata);
    }
  }, [isFullscreen]);

  const handleEditorChange = (value) => {
    setCode(value);
    setLastKeypress(Date.now()); // update the last keypress timestamp
    setSaved(false);
  };

  useEffect(() => {
    if (lastKeypress) {
      const intervalId = setInterval(() => {
        const timeSinceLastKeypress = Date.now() - lastKeypress;
        setTimeSinceLastKeypress(timeSinceLastKeypress);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [lastKeypress]);

  useEffect(() => {
    if (timeSinceLastKeypress >= 5000 && saved === false) {
      if (code != codeStorage) {
        let formData = new FormData();
        formData.append("id", compid);
        formData.append("code", code);
        formData.append("email", cookies.email);
        axios.post("http://127.0.0.1:8000/competition/code/save/", formData);
        setCodeStorage(code);
      }
      setSaved(true);
    }
  }, [timeSinceLastKeypress]);

  const apiKeys = [
    "ceef346648mshb8b0bc0c58f92fap18fcfajsnce13d33266db",
    "33d2a54a68msh34f7de118fc1f89p115b44jsn64883fdf5658",
  ];

  const [apiKey, setApiKey] = useState(0);

  const handle_execute = (submit) => {
    setExecuted({});
    setTokens({});
    if (submit == true) {
      setSubmission(true);
    }
    setTime(0);
    setMemory(0);
    let totalTime = 0;
    let totalMemory = 0;
    console.log(apiKeys[apiKey]);
    if (inputs.length > 0) {
      for (let i = 0; i < inputs.length; i++) {
        const options = {
          method: "POST",
          url: "https://judge0-ce.p.rapidapi.com/submissions",
          params: { fields: "*" },
          headers: {
            "x-rapidapi-key": apiKeys[apiKey],
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          data: {
            language_id: 71,
            source_code: code,
            stdin: JSON.stringify(inputs[i]),
          },
        };

        axios
          .request(options)
          .then((res) => {
            setTokens((existing) => ({ ...existing, [i]: res.data.token }));
            setTimeout(() => {
              axios
                .request({
                  method: "GET",
                  url: `https://judge0-ce.p.rapidapi.com/submissions/${res.data.token}`,
                  params: {
                    fields: "*",
                  },
                  headers: {
                    "x-rapidapi-key": apiKeys[apiKey],
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                  },
                })
                .then((response) => {
                  setExecuted((prevExecuted) => ({
                    ...prevExecuted,
                    [res.data.token]: response.data.stdout,
                  }));
                  totalTime += Number(response.data.time);
                  totalMemory += response.data.memory;
                  setTime(totalTime);
                  setMemory(totalMemory);
                });
            }, 2500);
          })
          .catch(
            setApiKey((prev) => {
              if (prev == apiKeys.length - 1) {
                return 0;
              } else {
                return prev + 1;
              }
            })
          );
      }
    } else {
      const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: { fields: "*" },
        headers: {
          "x-rapidapi-key": apiKeys[apiKey],
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: {
          language_id: 71,
          source_code: code,
        },
      };

      axios
        .request(options)
        .then((res) => {
          setTokens((existing) => ({ ...existing, [i]: res.data.token }));
          setTimeout(() => {
            axios
              .request({
                method: "GET",
                url: `https://judge0-ce.p.rapidapi.com/submissions/${res.data.token}`,
                params: {
                  fields: "*",
                },
                headers: {
                  "x-rapidapi-key": apiKeys[apiKey],
                  "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                },
              })
              .then((response) => {
                setExecuted((prevExecuted) => ({
                  ...prevExecuted,
                  [res.data.token]: response.data.stdout,
                }));
                totalTime += Number(response.data.time);
                totalMemory += response.data.memory;
                setTime(totalTime);
                setMemory(totalMemory);
              });
          }, 2500);
        })
        .catch(
          setApiKey((prev) => {
            if (prev == apiKeys.length - 1) {
              return 0;
            } else {
              return prev + 1;
            }
          })
        );
    }
  };

  const submit = () => {
    handle_execute(true);
  };

  const countRepetitions = (arr, target) => {
    let count = 0;
    arr.forEach((element) => {
      if (element === target) {
        count++;
      }
    });
    return count;
  };

  useEffect(() => {
    if (Object.keys(executed).length == outputs.length) {
      setResults([]);
      console.log(tokens);
      console.log(executed);
      for (let i = 0; i < Object.keys(tokens).length; i++) {
        setResults((existing) => [
          ...existing,
          areEqual(executed[tokens[i]], outputs[i]),
        ]);
      }
      //console.log(submission)
      if (submission) {
        let formdata = new FormData();
        formdata.append("session_code", compid);
        formdata.append("code", code);
        formdata.append("time", time / 3);
        formdata.append("memory", memory / 3);
        formdata.append("email", cookies.email);
        if (countRepetitions(results, true) == outputs.length) {
          formdata.append("correct", true);
        } else {
          formdata.append("correct", false);
        }
        console.log(time / 3);
        axios.post("http://127.0.0.1:8000/competition/code/submit/", formdata);
      }
    }
  }, [executed]);

  function areEqual(a, b) {
    if (typeof a === "undefined" || typeof b === "undefined") {
      return;
    }
    a = JSON.stringify(a)
      .replace(/\\n/g, "")
      .replace(/\s+/g, "")
      .replace(/["']/g, "");
    b = JSON.stringify(b)
      .replace(/\\n/g, "")
      .replace(/\s+/g, "")
      .replace(/["']/g, "");

    return a === b;
  }

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/competition/details/${compid}/?email=${cookies.email}`
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.message == "barred") {
          alert("You have been disqualified from this competition.");
          window.location.href = "/competition";
        } else {
          setQuestion(res.data.question);
          setInputs(res.data.inputs);
          setOutputs(res.data.outputs);
          setCode(res.data.code);
        }
      });
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [disabled]);

  const handleVisibilityChange = () => {
    if (document.hidden && disabled === false && submission === false) {
      //count++;
      console.log(disabled);
      alert("You are disqualified");
      setDisabled(true);
      let formdata = new FormData();
      formdata.append("session_code", compid);
      formdata.append("email", cookies.email);
      formdata.append("code", code);
      formdata.append("barred", true);
      axios.post("http://127.0.0.1:8000/competition/code/submit/", formdata);
    } else {
      //document.getElementById("count").innerHTML = count;
      console.log("came back");
    }
  };

  return !submission ? (
    <div onClick={handleFullscreen}>
      <div
        className="disabled"
        style={{ display: disabled ? "block" : "none" }}
      ></div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", height: "95vh", backgroundColor: "red" }}>
          <div
            style={{
              height: "30vh",
              backgroundColor: "yellow",
              marginTop: "-2vh",
            }}
          >
            <p>{question}</p>
          </div>
          <div style={{ height: "60vh", backgroundColor: "yellow" }}>
            <table>
              <tr>
                {inputs.length > 0 ? <th>Inputs</th> : null}
                <th>Outputs</th>
              </tr>
              {inputs.length > 0
                ? inputs.map((input, index) => {
                    return (
                      <tr key={index}>
                        {typeof input == "string" && input.include("\n") ? (
                          <td
                            dangerouslySetInnerHTML={{
                              __html: outputs[index]
                                .replace(/\n/g, "<br>")
                                .replace(/"/g, ""),
                            }}
                          />
                        ) : (
                          <td>{JSON.stringify(input)}</td>
                        )}

                        {typeof outputs[index] == "string" &&
                        outputs[index].include("\n") ? (
                          <td>
                            {typeof outputs[index] == "string" &&
                            outputs[index].includes("\\n") ? (
                              <td
                                dangerouslySetInnerHTML={{
                                  __html: outputs[index]
                                    .replace(/\n/g, "<br>")
                                    .replace(/"/g, ""),
                                }}
                              />
                            ) : (
                              <td>{JSON.stringify(output)}</td>
                            )}
                          </td>
                        ) : (
                          <td>{JSON.stringify(outputs[index])}</td>
                        )}
                      </tr>
                    );
                  })
                : outputs.map((output, index) => {
                    return (
                      <tr key={index}>
                        {typeof output == "string" && output.includes("\n") ? (
                          <td
                            dangerouslySetInnerHTML={{
                              __html: output
                                .replace(/\n/g, "<br>")
                                .replace(/"/g, ""),
                            }}
                          />
                        ) : (
                          <td>{JSON.stringify(output)}</td>
                        )}
                      </tr>
                    );
                  })}
            </table>
            <p>
              {results.length > 0
                ? results.map((result, index) => {
                    return (
                      <span key={index}>{result ? "Right" : "Wrong"}</span>
                    );
                  })
                : "No outputs"}
            </p>
          </div>
          <p></p>
          <button onClick={handle_execute}>Execute</button>
          <button onClick={submit}>Submit</button>
        </div>
        <Editor
          height="95vh"
          width={`50%`}
          language="python"
          value={code}
          theme="vs-dark"
          defaultValue="# Type here"
          onChange={handleEditorChange}
        />
      </div>
    </div>
  ) : (
    <div onClick={handleFullscreen}>
      <div></div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", height: "95vh", backgroundColor: "red" }}>
          <div
            style={{
              height: "30vh",
              backgroundColor: "yellow",
              marginTop: "-2vh",
            }}
          >
            <p>{question}</p>
          </div>
          <div style={{ height: "60vh", backgroundColor: "yellow" }}>
            <table>
              <tr>
                <th>Inputs</th>
                <th>Outputs</th>
              </tr>
              {inputs.map((input, index) => {
                return (
                  <tr key={index}>
                    <td>{JSON.stringify(input)}</td>
                    <td>{JSON.stringify(outputs[index])}</td>
                    <td></td>
                  </tr>
                );
              })}
            </table>
            <p>
              {results.length > 0
                ? results.map((result, index) => {
                    return (
                      <span key={index}>{result ? "Right" : "Wrong"}</span>
                    );
                  })
                : "No outputs"}
            </p>
          </div>
          <p></p>
          <button onClick={handle_execute}>Execute</button>
          <button onClick={submit}>Submit</button>
        </div>
        <Editor
          height="95vh"
          width={`50%`}
          language="python"
          value={code}
          theme="vs-dark"
          defaultValue="# Type here"
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default Coding;
