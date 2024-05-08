import { useState } from "react";
import QuestionForm from "./components/QuestionForm";

function App() {
  const [tripPlan, setTripPlan] = useState(null);

  const handleTripPlan = (plan) => {
    setTripPlan(plan);
  };
  return (
    <div>
      {!tripPlan && <QuestionForm onTripPlan={handleTripPlan} />}
      {tripPlan && <div className="w-10/12 m-auto space-y-2"><h1 className="text-xl font-bold">Here's is your Trip plan:</h1><p>{tripPlan}</p></div>}
    </div>
  );
}

export default App;
