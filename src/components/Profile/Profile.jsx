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
    <div>
      {typeof profileData == "object" && (
        <>
          <div className="p-8 rounded-lg shadow-lg transform scale-110 mt-6 w-1/2 mx-auto bg-white">
            <h1 className="text-center text-2xl font-bold underline mb-5">
              Coding Questions
            </h1>
            <div className="flex items-center space-x-8 justify-center">
              <div
                className="relative"
                onMouseEnter={() => setHover1(true)}
                onMouseLeave={() => setHover1(false)}
              >
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    {hover1 ? (
                      <div className="text-2xl font-bold">
                        {(
                          (profileData.completed / profileData.total) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">
                          {profileData.completed}
                        </div>
                        <div className="w-full border-t border-gray-700 my-2"></div>
                        <div className="text-lg text-gray-400">
                          {profileData.total}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-teal-400 text-xl">Easy</span>
                  <span className="text-xl">
                    {profileData.questions["E"][0]}/
                    {profileData.questions["E"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-yellow-400 text-xl">Medium</span>
                  <span className="text-xl">
                    {profileData.questions["M"][0]}/
                    {profileData.questions["M"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-red-500 text-xl">Hard</span>
                  <span className="text-xl">
                    {profileData.questions["H"][0]}/
                    {profileData.questions["H"][1]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-lg shadow-lg transform scale-110 mt-10 w-1/2 mx-auto bg-white">
            <h1 className="text-center text-2xl font-bold underline mb-5">
              Quiz Data
            </h1>
            <div className="flex items-center space-x-8 justify-center">
              <div
                className="relative"
                onMouseEnter={() => setHover2(true)}
                onMouseLeave={() => setHover2(false)}
              >
                <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    {hover2 ? (
                      <div className="text-2xl font-bold">
                        {(
                          (profileData.quiz_completed / profileData.quiz_total) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">
                          {profileData.quiz_completed}
                        </div>
                        <div className="w-full border-t border-gray-700 my-2"></div>
                        <div className="text-lg text-gray-400">
                          {profileData.quiz_total}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-teal-400 text-xl">Easy</span>
                  <span className="text-xl">
                    {profileData.quiz["E"][0]}/
                    {profileData.quiz["E"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-yellow-400 text-xl">Medium</span>
                  <span className="text-xl">
                    {profileData.quiz["M"][0]}/
                    {profileData.quiz["M"][1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-red-500 text-xl">Hard</span>
                  <span className="text-xl">
                    {profileData.quiz["H"][0]}/
                    {profileData.quiz["H"][1]}
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
