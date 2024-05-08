import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { sendAnswers } from "../services/api";
import "./QuestionForm.css"; // Import CSS file for styling

const hobbiesData = [
  { name: "ParaGliding", imageUrl: "https://cdn.pixabay.com/photo/2015/03/31/18/47/paraglider-701440_960_720.jpg" },
  { name: "Hiking", imageUrl: "http://www.atlasandboots.com/wp-content/uploads/2015/12/winter-hiking-3.jpg" },
  { name: "Cooking", imageUrl: "https://cdn.shopify.com/s/files/1/0445/1365/6985/files/elements-of-cooking-salt-fat-acid-heat.jpg?v=1638211044" },
  { name: "Photography", imageUrl: "https://expertphotography.b-cdn.net/wp-content/uploads/2020/07/social-media-for-photographers-follow-1.jpg" },
  { name: "Swimming", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8R8b0aj7OFci_CArnuS44Ee3_WgbifY_ZJtL0uvaLiA&s" },
  { name: "Skiing", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdPkH4KkfCI5BoeLHVBJCSLfmT9HpMjxYwjY93Yv3V_Q&s" },
  { name: "Skydiving", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcX1eJ0WkssUSztdxYSNVkIspzSxnCbIIvUDt0B_BiOQ&s" },
  { name: "Bungee Jumping", imageUrl: "https://campjugnoo.com/assets/images/bungee-jumping.jpg" },
  { name: "Horse Riding", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuKzoqV6wqsWrDS_mRrR4h3hyKnBz7WZ8XD3jZTcgtNA&s" },
  { name: "Singing", imageUrl: "https://i0.wp.com/caricole.com/wp-content/uploads/2022/06/AdobeStock_388952236-1-scaled.jpeg?resize=1920%2C1280&ssl=1" },
  { name: "Bike or Car Racing", imageUrl: "https://img.redbull.com/images/c_crop,x_0,y_439,h_3200,w_2560/c_fill,w_900,h_1125/q_auto:low,f_auto/redbullcom/tv/FO-1Z73WM3KH5N11/racing-together-motorcycle-race" },
  { name: "Dancing", imageUrl: "https://static01.nyt.com/images/2022/05/29/arts/29mj-dancer-2/merlin_198901542_0b8dadc5-bd9b-4ce4-b52a-f477f2608abb-mediumSquareAt3X.jpg" },
];

function QuestionForm({ onTripPlan }) {
  const [answers, setAnswers] = useState({
    origin: "",
    city: "",
    start_date: new Date(),
    end_date: new Date(),
    interests: "",
    hobbies: [],
  });

  // State variables for displaying "Please wait" message and output
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [output, setOutput] = useState("");
  const [showOverlay, setShowOverlay] = useState(true);
  const [showHobbiesModal, setShowHobbiesModal] = useState(false);
  const [otherHobby, setOtherHobby] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [showImage, setShowImage] = useState(true);

  // useEffect for image transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(false);
      setTimeout(() => {
        setShowOverlay(false);
      }, 10000); // Adjust the timing for smooth transition
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleStartDateChange = (date) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      start_date: date,
    }));
  };

  const handleEndDateChange = (date) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      end_date: date,
    }));
  };

  const handleHobbySelection = (selectedHobby) => {
    if (selectedHobby === "Others") {
      setIsOtherSelected((prev) => !prev);
      return;
    }

    const isSelected = answers.hobbies.includes(selectedHobby);
    if (isSelected) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        hobbies: prevAnswers.hobbies.filter((hobby) => hobby !== selectedHobby),
      }));
    } else {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        hobbies: [...prevAnswers.hobbies, selectedHobby],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGeneratingPlan(true); // Set state to indicate plan generation
    try {
      const data = {
        origin: answers.origin,
        city: answers.city,
        start_date: formatDate(answers.start_date),
        end_date: formatDate(answers.end_date),
        interests: answers.interests,
        hobbies: answers.hobbies.join(","),
      };
      const response = await sendAnswers(data);
      setOutput(response.result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="background-image">
      <div className="question-form max-w-lg mx-auto p-6 rounded-lg shadow-md">
        {!showImage && (
          <img
            src="https://img.freepik.com/free-vector/realistic-travel-background-with-elements_52683-77784.jpg"
            alt="Background Image"
            className="fullscreen-background"
          />
        )}
        {showImage && (
          <div className={`fullscreen-overlay ${showOverlay ? 'overlay-show' : ''}`}>
            <img
              src="https://www.wallpapertip.com/wmimgs/167-1674632_background-image-for-travel-website.jpg"
              alt="Your Image"
              className="fullscreen-image"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6">Tell us about your trip</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Input for origin */}
          <div>
            <label className="block mb-1" htmlFor="origin">From where will you be traveling from?</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              type="text"
              id="origin"
              name="origin"
              placeholder="Starting city"
              value={answers.origin}
              onChange={handleChange}
              required
            />
          </div>
          {/* Input for city */}
          <div>
            <label className="block mb-1" htmlFor="city">What cities are you interested in visiting?</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              type="text"
              id="city"
              name="city"
              placeholder="Enter your destination metropolitan cities(Ex. Hyderabad, Delhi, Chennai etc)"
              value={answers.city}
              onChange={handleChange}
              required
            />
          </div>
          {/* Datepicker for start and end date */}
          {!showImage && (
            <div>
              <label className="block mb-1" htmlFor="date_range">What is your preferred date range for traveling?</label>
              <div className="flex space-x-4">
                <DatePicker
                  selected={answers.start_date}
                  onChange={handleStartDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
                <DatePicker
                  selected={answers.end_date}
                  onChange={handleEndDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>
          )}
          {/* Input for hobbies */}
          <div>
            <label className="block mb-1" htmlFor="hobbies">What are some of your interests and hobbies?</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black cursor-pointer"
              placeholder="Select Hobbies"
              onClick={() => setShowHobbiesModal(true)}
              readOnly
            />
            {showHobbiesModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="bg-white p-6 rounded-lg shadow-md max-h-80 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">Select Hobbies</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {hobbiesData.map((hobby) => (
                      <div
                        key={hobby.name}
                        className={`cursor-pointer flex flex-col items-center hobby-option ${answers.hobbies.includes(hobby.name) ? 'selected' : ''}`}
                        onClick={() => handleHobbySelection(hobby.name)}
                      >
                        <img
                          src={hobby.imageUrl}
                          alt={hobby.name}
                          className={`w-24 h-24 object-cover rounded-full border-2 border-gray-300 hobby-img ${answers.hobbies.includes(hobby.name) ? 'selected-img' : ''}`}
                        />
                        <span className="mt-2 text-sm">{hobby.name}</span>
                      </div>
                    ))}
                    <div
                      className={`cursor-pointer flex flex-col items-center hobby-option ${isOtherSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setIsOtherSelected((prev) => !prev);
                        setOtherHobby("");
                      }}
                    >
                      <span className="text-gray-400">Others</span>
                    </div>
                  </div>
                  {/* Display input field only when "Others" is selected */}
                  {isOtherSelected && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Enter other hobbies"
                        value={otherHobby}
                        onChange={(e) => setOtherHobby(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    </div>
                  )}
                  <button
                    className="mt-4 w-full bg-black text-white rounded-lg py-2 hover:bg-opacity-80"
                    onClick={() => setShowHobbiesModal(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Display selected hobbies */}
          <div className="mt-2">
            {answers.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
              >
                {hobby}
                <button
                  type="button"
                  className="ml-2 outline-none focus:outline-none"
                  onClick={() => handleHobbySelection(hobby)}
                >
                  &#x2715;
                </button>
              </span>
            ))}
            {/* Display other hobby if selected */}
            {otherHobby && (
              <span
                className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
              >
                {otherHobby}
                <button
                  type="button"
                  className="ml-2 outline-none focus:outline-none"
                  onClick={() => {
                    setOtherHobby("");
                    setIsOtherSelected(false);
                  }}
                >
                  &#x2715;
                </button>
              </span>
            )}
          </div>
          {/* Button to submit the form */}
          <button
            className="w-full bg-black text-white rounded-lg py-2 hover:bg-opacity-80"
            type="submit"
            disabled={isGeneratingPlan}
          >
            {isGeneratingPlan ? "Generating Trip Plan..." : "Generate Trip Plan"}
          </button>
          {/* Conditional rendering of "Please wait" message */}
          {isGeneratingPlan && <p>Please wait until the output is generated...</p>}
        </form>

        {/* Output box */}
        {showImage === false && !showHobbiesModal && (
  <div className="output-box">
    <h3>Output:</h3>
    <textarea
      className="output-textarea"
      value={output}
      readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionForm;
