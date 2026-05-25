1.**Separation of Concerns:**

*In your own words, explain the distinct responsibilities of the Model, View (the external frontend), and Controller in your final project structure.*
- Model handles all the data and logic the app contains. In the final project structure, it has methods to connect to the database and access the data, as well as SQL queries to perform CRUD.
- View displays data in a user interface and handles user input. In the final project sturcture, it has the HTML/Javascript/CSS code for the frontend application and functions that handle input. It also has methods to send requests to the API.
- Controller updates the model and/or view based on user input (acts as an intermediary between model and view). In the final project structure, it allows the model to carry out its functions to perform CRUD operations and interact with the view based on the user input.

*How does having a separate frontend View (Practical 05) simplify the responsibilities of your backend API?*
- View sends requests to the backend API and then receives raw JSON data from the API repsonse. It simplifies the retrieval and submission of data, and allows the app to respond dynamically to user input. The view is also separate from the backend API, so the code's clarity is enhanced and changes to the frontend will not affect the backend.

2.**Robustness and Security:**

*Consider the journey from a simple API (Practical 03) to a more robust one (Practical 04) and a full-stack application (Practical 05). At which stage do you think it became easier to identify and fix bugs related to data handling or API responses? Why?*
- In my opinion it became easiesr to fix bugs in data handling and API responses in Practical 04, as the code was separated into different sections following the model and controller of the MVC pattern, which allowed for easy identification for errors in the data (models) and the API responses (controllers).
- In Practical 05, it became even easier to identify the bugs as there was a clearer separation if they were coming from problems in the backend or the frontend logic.

3.**Challenges and Problem Solving:**

*What was the most challenging aspect for you across Practical 03, 04, and 05? Describe the problem and how you approached solving it.*
- In Practical 03, I was unsure if I had to change the server name placeholder value "localhost" in dbConfig.js. Because I thought it was necessary, I encountered an error right off the bat, so simply leaving the value alone solved the problem.
- In Practical 04, I found it challenging to identify which parts of the code needed to be refactored and to which section (model, data or validation). I especially struggled with various bugs related to incorrectly identifying the functions that needed to change in the refactoring process. I overcame this hurdle by researching the node.js and MVC documentation to understand the significance of each part, which gave me a better understanding of how to refactor the code.
- In Practical 05, my biggest challenge was fixing bugs (and refactoring, in a way). I was certain that after following the format of the Part A lab exercise, there would be few problems with Part B. However, I failed to realise that back in Practical 04, I made a mistake in the studentController which — only when combined with the view implementation — caused the id to return as undefined after the creation of a student. After comparing the code of both book and student APIs more carefully, I managed to fix the logic of that function.

*Thinking critically, if you had to add a new feature (e.g., adding a "genre" field to books, or implementing user authentication), how would the current MVC structure with a separate View layer help you approach this task in a more organized and efficient way compared to the initial Practical 03 structure?*
- Since model, view and controller are now separate, it is possible to identify which parts of the code need to be modified or what needs to be created to include these features. For example, new data fields would mean the model needs modification (changes to the data retrieved), and a new page would mean the view needs modification (new HTML and JavaScript code are required). The view also makes it easier to test code as it sends requests to and receives responses directly from the API. The controller should also be updated for each of these changes since it is the intermediary between both.

4.**Experiential Learning:**

*How did the hands-on coding and refactoring in these practicals help you understand the concepts of MVC, validation, error handling, and parameterized queries compared to just reading about them?*
- It is more engaging and educational — I can practice writing code, which helps me understand the logic, as well as see the newly introduced concepts in action. It also prompted me to conduct further research to fix the bugs or implement optional features.