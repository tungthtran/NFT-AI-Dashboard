## Project Description
NFT Dashboard is a dashboard with Artificial Intelligence integrated, connecting all the information about different NFT collections that a trader/collector would need. Our tech stack includes React.js for frontend, Node.js, Express.js and MongoDB for backend, and the web application will be hosted on GCP (Google Cloud Platform). Other than factual information about a collection, for example, current floor price (the lowest price of an NFT belongs to that collection), listed count, volume, we also provide users with the sentimental analysis scores of that collection. While the factual information is retrieved from certain NFT marketplaces like OpenSea or MagicEden, we use Natural Language Processing and Machine Learning to calculate the sentiment score of each NFT collection in the Solana blockchain. The tweets from each collection’s Twitter are collected, run through an AI model that we build, and finally returned for display in the NFT dashboard. Our vision is to integrate AI and Blockchain together to leverage users’ trading experience for the purpose of this project.


## Project Design
# The components of the project:
- A Python data crawler to collect real-time data from Twitter and MagicEden NFT marketplace.
- A pre-trained NLP model distributed among three Google Colab workers to increase performance by utilizing GPU resources.
- A Redis queue that works as a load balancer, taking data from the crawler and triggering the processing on GPU workers.
- A MongoDB database, as it better suits the JSON output provided by the NLP model.
- Node.js server-side with RESTful APIs.
- React.js client-side built on top of Material-UI frame, integrated with other third-party libraries like TradingView for visualization purposes.
