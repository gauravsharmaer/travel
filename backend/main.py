from datetime import datetime
from crewai import Crew
from textwrap import dedent
from agents import TravelAgents
from tasks import TravelTasks
import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request

load_dotenv()

import openai

# openai.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

class TripCrew:
    def __init__(self, origin, city, start_date, end_date, interests, hobbies):
        self.origin = origin
        self.city = city
        self.start_date = start_date  # Updated to receive start_date separately
        self.end_date = end_date      # Updated to receive end_date separately
        self.interests = interests
        self.hobbies = hobbies

    def run(self):
        # Convert start_date and end_date to datetime objects
        start_date = datetime.strptime(self.start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(self.end_date, "%Y-%m-%d").date()

        # Define your custom agents and tasks in agents.py and tasks.py
        agents = TravelAgents()
        tasks = TravelTasks()

        # Define your custom agents and tasks here
        expert_travel_agent = agents.expert_travel_agent()
        city_selection_expert = agents.city_selection_expert()
        local_tour_guide = agents.local_tour_guide()

        # Custom tasks include agent name and variables as input
        plan_itinerary = tasks.plan_itinerary(
            expert_travel_agent,
            self.city,
            f"{start_date} to {end_date}",  # Pass combined travel_dates as a single string
            self.interests
        )

        identify_city = tasks.identify_city(
            city_selection_expert,
            self.origin,
            self.city,
            self.interests,
            f"{start_date} to {end_date}"  # Pass combined travel_dates as a single string
        )

        gather_city_info = tasks.gather_city_info(
            local_tour_guide,
            self.city,
            f"{start_date} to {end_date}",  # Pass combined travel_dates as a single string
            self.interests
        )

        # Define your custom crew here
        crew = Crew(
            agents=[expert_travel_agent,
                    city_selection_expert,
                    local_tour_guide
                    ],
            tasks=[
                plan_itinerary,
                identify_city,
                gather_city_info
            ],
            verbose=True,
        )

        result = crew.kickoff()
        return result

@app.route('/generate_trip_plan', methods=['POST'])
def generate_trip_plan():
    data = request.json
    trip_crew = TripCrew(
        data['origin'],
        data['city'],
        data['start_date'],
        data['end_date'],
        data['interests'],
        data['hobbies']
    )
    result = trip_crew.run()
    return jsonify({"result": result})

if __name__ == '__main__':
    openai.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    app.run(debug=True)
