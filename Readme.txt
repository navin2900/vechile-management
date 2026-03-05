Software Requirement Specification (SRS)
Vehicle Buy & Sell System
Abstract of the Project
This project aims to develop a web-based Vehicle Buy & Sell Management System, similar to an OLX platform, where users can post vehicles for sale, browse available vehicles, place bids, and directly communicate with sellers. The system provides features such as user registration and authentication, vehicle listing and advertisement management, buying and selling vehicles, bidding system for vehicles, document upload and verification, and admin moderation and reporting.
Functional Components of the Project
User Functions
•	Register and log in securely.
•	Create vehicle advertisements for selling vehicles.
•	Upload vehicle details such as model, year, price, mileage, images, and documents.
•	Browse and search vehicles by category, price, brand, and location.
•	Buy vehicles by contacting sellers.
•	Place bids on listed vehicles.
•	View highest bid and bidding history.
•	Edit or delete their own vehicle listings.
•	Upload vehicle documents (RC, Insurance, PUC).
•	Send and receive messages from other users.
Admin Functions
•	Manage user accounts.
•	Verify vehicle listings and uploaded documents.
•	Monitor and remove fake or illegal advertisements.
•	View and control bidding activities.
•	Generate reports on users and vehicles.
•	Manage categories and system notifications.
•	Handle user complaints and support queries.
Software Requirement Specification
No	Requirement	Essential / Desirable	Description
RS1	User Registration & Login	Essential	Users register and log in securely using encrypted passwords.
RS2	Vehicle Listing (Sell)	Essential	Users can post vehicle ads with price, photos, and description.
RS3	Vehicle Browsing & Search	Essential	Users can browse and filter vehicles.
RS4	Buy Vehicle Module	Essential	Users can contact seller to buy a vehicle.
RS5	Bidding System	Essential	Users can place bids and view highest bid.
RS6	Bid History Tracking	Desirable	Stores all bids with time and user details.
RS7	Vehicle Details Management	Essential	Sellers can edit or remove listings.
RS8	Document Upload & Verification	Essential	Upload RC, Insurance, PUC documents.
RS9	Messaging System	Essential	Buyer and seller communicate via in-app chat.
RS10	Admin Dashboard	Essential	Admin manages users, listings, bids, and reports.
RS11	Advertisement Approval	Desirable	Admin verifies ads before publishing.
RS12	Notification System	Desirable	Alerts for bids and messages.
RS13	Analytics & Reports	Desirable	Reports on users and vehicles sold.
RS14	Vehicle Status Tracking	Desirable	Tracks vehicle as Available or Sold.
RS15	User Feedback & Support	Desirable	Users can send feedback and complaints.
Assumptions
1.	Users provide valid email or mobile number for registration.
2.	Users provide accurate vehicle information.
3.	Uploaded documents are authentic and readable.
4.	Internet connectivity is available.
5.	Admin verifies listings regularly.
6.	Each vehicle listing has a unique ID.
7.	System clock generates accurate timestamps.
8.	Users follow legal rules for vehicle trading.

Create me an srs project using these set of requirements wiothout skipping out on any and all requirements,use react as the coding language and connect it to a mongo db server for backend progress without failure.Make the ui of the site more like proffesional and informative like websites like olx carwala etc,and add a bidding feature for the users to buy and sell vehicles throught bidding and add an option for the admin to intervine these auction or bidding by intervining it powers for the admin to stop the bidding change the inital bidding value,etc (add more features that are more feasible or useful according to the standards of biddings and auctions). Create a feature for the buyer to see the vehicles pictures and on the left side with a search box for searching the vehicles specs,violations,insurance,and other details by keyword.build the end to end app and check whether all the features are implemented or not if not implemented without any excuse and check for any errors and use a better ui for simplicity and professionalism and add a user and admin login with the background colour of the website on light mode as a shade of mettalic grey with professionalism and style.add dark mode too