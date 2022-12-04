# Funflix Data Warehousing with Redshift

## Instructions

You are working as a data engineer for an Australian media company Funflix. Customers comes to Funflix’s platform and subscribe to become a subscribed user. Funflix content experts then hand picks a collection of movies as per user’s taste and sends these recommendations to the user via email. Things are going well so far but Funflix’s executive team do not see potential growth into future with the existing IT arrangements and asked you to innovate their company’s IT processes to enable Funflix’s future growth.

Ele is Funflix’s IT expert and she knows all about the current systems and she is also your POC (point-of-contact) in this project. Here are the key points of the 1st meeting between you and Ele:

You: I would like to know about the state of data. How it looks, where it is, Who does what?

Ele: We have a user data in which we store our subscribers’ details, a movie data to store movie details and we also collect our user’s feedback on movies. All the data is in 3 files that we maintain in MS-Excel on our local server.

You: How can I get access this data?

Ele: I can email you these 3 files or share them via pen-drive? The file size is not much.

You: Okay, you can email them then.

---

You got the data via email (email is archived for you in the git repo) and now it’s time to start the innovative work. You have to perform the following steps in order to pass the test:

1. There is a Redshift Serverless Cluster running for you. The credentials are available in the `wysde` aws secret. The database name is `funflix`. You have to create a schema of your name there along with `raw` suffix e.g. John Doe would create a schema `johndoe_raw`.
4. Now, as you got 3 files in mail — for each file, do the following:
    1. Load into a dataframe (pandas or Pyspark dataframe e.g.)
    2. Add column names. You can find the list of columns here:
        - cols
            - ['userid','age','gender','occupation',"zipcode"]
            - ["movieid", "movie_title", "release_date", "video_release_date", "imdb_url", "unknown", "action", "adventure", "animation", "children", "comedy", "crime", "documentary", "drama", "fantasy", "film_noir", "horror", "musical", "mystery", "romance", "scifi", "thriller", "war", "western"]
            - ['userid','itemid','rating','timestamp']
    3. Push the dataframe to database with correct schema.
5.  Analyze the DDLs in Redshift and use this analysis to create a schema diagram (Entity-Relation Diagram). Use [https://dbdiagram.io/](https://dbdiagram.io/) to create it.
6.  Once you finish the ER diagram and data ingestion to the warehouse, submit the `.png` and `.py`/`.ipynb` files by creating a new PR and adding your files in `assignments > labassignments > assignment3 > johndoe`. Make sure to replace `johndoe` with your own name.
7. Inform the instructor about the PR and ask for review.