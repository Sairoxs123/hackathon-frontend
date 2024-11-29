import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Competition = () => {
  const [codeStorage, setCodeStorage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(null);
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
  const [disabled, setDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [execution, setExecution] = useState(null);
  const [question, setQuestion] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(null);

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

  const { compid } = useParams();

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
                  setExecution(true);
                });
            }, 2500);
          })
          .catch((err) => {
            setApiKey((prev) => {
              if (prev == apiKeys.length - 1) {
                return 0;
              } else {
                return prev + 1;
              }
            });
            setExecution(false);
          });
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
                  exec: response.data.spout,
                }));
                console.log(response.data.spout);
                totalTime += Number(response.data.time);
                totalMemory += response.data.memory;
                setTime(totalTime);
                setMemory(totalMemory);
                setExecution(true);
              });
          }, 2500);
        })
        .catch((err) => {
          setApiKey((prev) => {
            if (prev == apiKeys.length - 1) {
              return 0;
            } else {
              return prev + 1;
            }
          });
          setExecution(false);
        });
    }
  };

  useEffect(() => {
    if (execution == false) {
      toast.error("An error has occurred. Please try again.", {
        position: "top-right", // Position (top-right, top-center, etc.)
        autoClose: 5000, // Duration in milliseconds (5 seconds)
        hideProgressBar: false, // Show/hide the progress bar
        closeOnClick: true, // Close on click
        pauseOnHover: true, // Pause on hover
        draggable: true, // Make the toast draggable
        progress: undefined, // Custom progress bar animation (e.g., a function)
        theme: "light", // Set the theme ("light" or "dark")
      });
      setExecution(null)
    } else if (execution == true) {
      toast.success("Code executed successfully.", {
        position: "top-right", // Position (top-right, top-center, etc.)
        autoClose: 5000, // Duration in milliseconds (5 seconds)
        hideProgressBar: false, // Show/hide the progress bar
        closeOnClick: true, // Close on click
        pauseOnHover: true, // Pause on hover
        draggable: true, // Make the toast draggable
        progress: undefined, // Custom progress bar animation (e.g., a function)
        theme: "light", // Set the theme ("light" or "dark")
      });
    }
  }, [execution])

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
    setResults([]); // Clear previous results

    if (Object.keys(executed).length === outputs.length) {
      if (Object.keys(tokens).length > 0) {
        // Using a for loop because we need the index
        for (let i = 0; i < Object.keys(tokens).length; i++) {
          // Functional update to setResults
          setResults((prevResults) => {
            const newResults = [...prevResults];
            newResults.push(areEqual(executed[tokens[i]], outputs[i]));
            return newResults;
          });
        }
      } else {
        // Map directly since we don't need the index
        setResults(
          Object.keys(executed).map((key, index) =>
            areEqual(executed[key], outputs[index])
          )
        );
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

  useEffect(() => {
    // Check if Battery API is supported
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(battery.level * 100);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
      });
    } else {
      console.log("Battery API not supported."); // Or handle this gracefully
    }
  }, []);

  return (
    <div onClick={handleFullscreen} className="bg-white">
      <nav className="flex justify-between items-center p-4 bg-gray-800"> {/* Added Tailwind classes */}
        {/* Other nav items can go here */}

        {batteryLevel !== null && ( // Conditionally render battery info
          <div className="flex items-center space-x-2 text-white"> {/* More Tailwind */}
            <i className="fas fa-battery-full text-yellow-400"></i> {/* Battery icon */}
             {/* Use battery charging icon when charging */}
            <span>{Math.round(batteryLevel)}%</span>
          </div>
        )}
      </nav>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", height: "95vh" }}>
          <div>
            <p>{question}</p>
            {inputs.length > 0
              ? inputs.map((input, index) => {
                  return (
                    <>
                      <p key={index}>Example {index + 1}</p>
                      <pre className="examples">
                        Input:
                        {typeof input === "string" ? (
                          input.includes("\n") ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: inputs[index]
                                  .replace(/\n/g, "<br>")
                                  .replace(/"/g, ""),
                              }}
                            />
                          ) : (
                            <span>
                              {input} <br />
                            </span>
                          )
                        ) : (
                          <span>
                            {JSON.stringify(input)} <br />
                          </span>
                        )}
                        Output:
                        {typeof outputs[index] == "string" ? (
                          <p>
                            {typeof outputs[index].includes("\\n") ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: outputs[index]
                                    .replace(/\n/g, "<br>")
                                    .replace(/"/g, ""),
                                }}
                              />
                            ) : (
                              <span>{JSON.stringify(output)}</span>
                            )}
                          </p>
                        ) : (
                          <span>{JSON.stringify(outputs[index])}</span>
                        )}
                      </pre>
                    </>
                  );
                })
              : outputs.map((output, index) => {
                  return (
                    <>
                      <p key={index}>Example {index + 1}</p>
                      Output:
                      <pre>
                        {typeof output == "string" ? (
                          output.includes("\n") ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: output
                                  .replace(/\n/g, "<br>")
                                  .replace(/"/g, ""),
                              }}
                            />
                          ) : (
                            output
                          )
                        ) : (
                          <span>{JSON.stringify(output)}</span>
                        )}
                      </pre>
                    </>
                  );
                })}
            <button onClick={handle_execute}>Execute</button>
            <button onClick={submit}>Submit</button>
          </div>
          <div>
            <h3>Test Results</h3>
            <div className="p-6">
              {inputs.length > 0 ? (
                <>
                  <div className="flex space-x-4 mb-4">
                    {inputs.map((_, index) => (
                      <button
                        key={index}
                        className={
                          results.length > 0
                            ? results[index] === true
                              ? activeTab === index + 1
                                ? "tab-active px-4 py-2 rounded text-green-300"
                                : "tab-inactive px-4 py-2 rounded text-green-600"
                              : activeTab === index + 1
                              ? "tab-active px-4 py-2 rounded text-red-600"
                              : "tab-inactive px-4 py-2 rounded text-red-600"
                            : activeTab === index + 1
                            ? "tab-active px-4 py-2 rounded text-white"
                            : "tab-inactive px-4 py-2 rounded text-gray-300"
                        }
                        onClick={() => setActiveTab(index + 1)}
                      >
                        Case {index + 1}
                      </button>
                    ))}
                  </div>
                  {typeof inputs[activeTab - 1] === "string" &&
                  JSON.stringify(inputs[activeTab - 1]).includes("\\n") ? (
                    <div>
                      <label>input = </label>
                      <p
                        type="text"
                        className="input-box"
                        dangerouslySetInnerHTML={{
                          __html: inputs[activeTab - 1]
                            .replace(/\n/g, "<br>")
                            .replace(/"/g, ""),
                        }}
                        readOnly
                      />
                    </div>
                  ) : (
                    <div>
                      <label>input = </label>
                      <input
                        type="text"
                        className="input-box"
                        value={JSON.stringify(inputs[activeTab - 1])}
                        readOnly
                      />
                    </div>
                  )}
                  {typeof outputs[activeTab - 1] === "string" &&
                  JSON.stringify(outputs[activeTab - 1]).includes("\\n") ? (
                    <div>
                      <label>input = </label>
                      <p
                        type="text"
                        className="input-box"
                        dangerouslySetInnerHTML={{
                          __html: outputs[activeTab - 1]
                            .replace(/\n/g, "<br>")
                            .replace(/"/g, ""),
                        }}
                        readOnly
                      />
                    </div>
                  ) : (
                    <div>
                      <label>output = </label>
                      <input
                        type="text"
                        className="input-box"
                        value={JSON.stringify(outputs[activeTab - 1])}
                        readOnly
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex space-x-4 mb-4">
                    {outputs.map((_, index) => (
                      <button
                        key={index}
                        className={
                          activeTab === index + 1
                            ? "tab-active px-4 py-2 rounded"
                            : "tab-inactive px-4 py-2 rounded"
                        }
                        onClick={() => setActiveTab(index + 1)}
                      >
                        Case {index + 1}
                      </button>
                    ))}
                  </div>
                  {typeof outputs[activeTab - 1] === "string" &&
                  JSON.stringify(outputs[activeTab - 1]).includes("\\n") ? (
                    <div>
                      <label>output = </label>
                      <p
                        type="text"
                        className="input-box"
                        dangerouslySetInnerHTML={{
                          __html: outputs[activeTab - 1]
                            .replace(/\n/g, "<br>")
                            .replace(/"/g, ""),
                        }}
                        readOnly
                      />
                    </div>
                  ) : (
                    <div>
                      <label>output = </label>
                      <input
                        type="text"
                        className="input-box"
                        value={JSON.stringify(outputs[activeTab - 1])}
                        readOnly
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
  )
};

export default Competition;
