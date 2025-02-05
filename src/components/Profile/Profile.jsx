import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import sendRequest from "../../utils/utils";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [profileData, setProfileData] = useState("");
  const [hover1, setHover1] = useState(false);
  const [hover2, setHover2] = useState(false);
  useEffect(() => {
    sendRequest("get", `/user/profile/home/?email=${cookies.email}`).then(
      (res) => {
        setProfileData(res);
      }
    );
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {typeof profileData == "object" && (
        <>
          <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-10 underline">
            Your Points
          </h1>

          <div className="flex justify-center space-x-8 mb-10">
            <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 bg-white">
              <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
                Question Points
              </h2>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                  <div className="text-4xl font-bold text-gray-800">
                    {profileData.points[0]}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 bg-white">
              <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
                Quiz Points
              </h2>
              <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                <div className="text-4xl font-bold text-gray-800">
                  {profileData.points[1]}
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 bg-white">
              <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
                Competition Points
              </h2>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                  <div className="text-4xl font-bold text-gray-800">
                    {profileData.points[2]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-10 underline">
            Your Accuracy (%)
          </h1>

          <div className="flex justify-center space-x-8 mb-10">
            <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 bg-white">
              <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
                Question Accuracy
              </h2>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                  <div className="text-4xl font-bold text-gray-800">
                    {profileData.accuracy[0]}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 bg-white">
              <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
                Quiz Accuracy
              </h2>
              <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                <div className="text-4xl font-bold text-gray-800">
                  {profileData.accuracy[1]}
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 bg-white">
              <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
                Competition Accuracy
              </h2>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                  <div className="text-4xl font-bold text-gray-800">
                    {profileData.accuracy[2]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-10 underline">
            Completion Status
          </h1>
          <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 mt-6 w-3/4 mx-auto bg-white">
            <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
              Coding Questions
            </h2>
            <div className="flex items-center space-x-8 justify-center">
              <div
                className="relative"
                onMouseEnter={() => setHover1(true)}
                onMouseLeave={() => setHover1(false)}
              >
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    {hover1 ? (
                      <div className="text-2xl font-bold text-gray-800">
                        {(
                          (profileData.completed / profileData.total) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-gray-800">
                          {profileData.completed}
                        </div>
                        <div className="w-full border-t border-gray-700 my-2"></div>
                        <div className="text-lg text-gray-500">
                          {profileData.total}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-teal-500 text-xl">Easy</span>
                  <span className="text-xl text-gray-800">
                    {profileData.questions["E"][0]}/
                    {profileData.questions["E"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-yellow-500 text-xl">Medium</span>
                  <span className="text-xl text-gray-800">
                    {profileData.questions["M"][0]}/
                    {profileData.questions["M"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-red-500 text-xl">Hard</span>
                  <span className="text-xl text-gray-800">
                    {profileData.questions["H"][0]}/
                    {profileData.questions["H"][1]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 mt-10 w-3/4 mx-auto bg-white">
            <h2 className="text-center text-2xl font-bold text-gray-700 underline mb-5">
              Quiz
            </h2>
            <div className="flex items-center space-x-8 justify-center">
              <div
                className="relative"
                onMouseEnter={() => setHover2(true)}
                onMouseLeave={() => setHover2(false)}
              >
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    {hover2 ? (
                      <div className="text-2xl font-bold text-gray-800">
                        {(
                          (profileData.quiz_completed /
                            profileData.quiz_total) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-gray-800">
                          {profileData.quiz_completed}
                        </div>
                        <div className="w-full border-t border-gray-700 my-2"></div>
                        <div className="text-lg text-gray-500">
                          {profileData.quiz_total}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-teal-500 text-xl">Easy</span>
                  <span className="text-xl text-gray-800">
                    {profileData.quiz["E"][0]}/{profileData.quiz["E"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-yellow-500 text-xl">Medium</span>
                  <span className="text-xl text-gray-800">
                    {profileData.quiz["M"][0]}/{profileData.quiz["M"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-red-500 text-xl">Hard</span>
                  <span className="text-xl text-gray-800">
                    {profileData.quiz["H"][0]}/{profileData.quiz["H"][1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
