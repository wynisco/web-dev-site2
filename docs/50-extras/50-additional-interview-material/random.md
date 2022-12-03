# Random Items

The following is a brief list of the resources that I think can be most helpful for preparing for the technical round of data engineering interviews. I intend for this to be a living document that I will continue to grow and update over time, adding new resources that I come across as well as those suggested to me by others in the field. I think preparation can be broadly broken up into these categories:

- Coding (Typically Python)
- SQL
- Database design
- Data architecture/big data technologies
- Soft skills

**Coding**

Fortunately, online resources abound for preparing for a technical coding interview. Here’s the rough flow I would take:

1. Get familiar with data structures. Focus on how to use lists and hashmaps (dictionaries) above all else and solve problems that require you to use and switch between them. Make sure you also understand trees and linked lists. You should understand when and why to use one data structure over another and the space and time complexity of basic operations on all of them (appending, inserting, searching).
2. Understand some of the basic algorithms such as binary search and merge sort. I recommend the book Grokking Algorithms by Aditya Y. Bhargava for a good introduction if you are not familiar with implementing them.
3. Work through problems on a platform like Leetcode or Hackerrank. I really recommend Leetcode, especially for refining your work down to one topic like a specific data structure or even to company-specific questions. Here is a link to their collection of “Easy” problems to work through, categorized by data structure: Leetcode Easy Problem Set. In my opinion, making the leap to Leetcode Premium is worth it to get full access to all of the questions plus solutions. They occasionally also offer month-long challenges that will pose a new question each day — take advantage of that! For most data engineering interviews, I think you can stick to “Easy” and “Medium” level problems. Focus on the data structures and understanding the complexity of your solutions. Don’t worry too much about delving into more advanced software engineering topics or “Hard” problems unless you anticipate that the role you are applying for will require it.

**SQL**

Ah, SQL. Seems so deceptively simple. Well, SQL has tripped me up a LOT in the past. I thought I knew it because I could do some INSERTS and SELECTS and knew how to do a basic JOIN or two. How naive I was… don’t underestimate SQL! That being said, it is not easy to find resources for truly tricky SQL problems to work through. Here are some I like:

1. Leetcode (again!). Go the Database category and work your way through all of the available problems. Remember how I said that for coding you could focus on Easy and Medium but not too worry too much about Hard? Well, not for SQL. You should aim to be able to solve problems across all three difficulties. As a caveat, I don’t find the Leetcode platform as good for SQL as I find it for coding problems; sometimes the questions are oddly categorized and/or poorly defined. Sort by Acceptance rate to get a better sense of the problem’s difficulty, and keep an eye on the problem’s “thumbs up/down” user rating: some of the poorly rated questions are not very clear and can lead to confusion.
2. Hackerrank. I actually think Hackerrank’s SQL problem sets are top notch (and you’ll get sick of reading about Weather Observation stations!). Work your way through them, focusing on diversifying the skills you work on (joins, window functions, CASE WHEN statements) and less on cranking out the problems that are just multiple complicated WHERE filters.

**Database Design**

Many companies will expect you to be able to design a proper data warehouse given a business use case. Luckily there are quite a few resources available out there for brushing up on these skills. While a lot of them are more textbook-like, try to push yourself to actually work through some real-life use cases by designing a data warehouse for an online store, a peer-to-peer marketplace, or a rideshare application. Sketch out the schema on paper or a whiteboard and build up a process for starting a new problem or design. Here are some books and online resources for learning about data warehouse design:

1. The Data Warehouse Toolkit: The Complete Guide to Dimensional Modelling. This is oft-cited and a great introduction to a lot of the foundational concepts
2. Star Schema:The Complete Reference by Christopher Adamson. This covers dimensional design and data warehouse architectures as well as touching on ETL principles.
3. I have seen the Udemy course Data Warehouse Concepts recommended, but have not taken it myself.

**Data Architecture and Big Data Technologies**

Some companies will expect you to have greater experience or familiarity in big data technologies (think Hadoop, Spark, and event processing technologies like Kafka) than others will. There are many books available that cover these technologies in-depth, but unfortunately due to the rate of change of the industry they tend to become out of date quite quickly. Nothing really beats experience here, but the following are some good resources for getting started and/or sharpening up your skills in preparation for an interview:

1. Designing Data-Intensive Applications by Martin Kleppmann is a great book that covers distributed systems thoroughly from both a theoretical and practical standpoint, and discusses a lot of the concepts that underpin Big Data tech like Hadoop and Kafka. (Shameless plug for the review I wrote last summer which goes into more detail on this particular book).
2. Try playing with Spark with Databricks Community Edition
3. Read some of the official documentation for things like Hadoop, Spark, Kafka, Hive. Some companies like to ask questions to test your understanding of the underlying concepts of big data frameworks and technologies, and the official documentation often gives the most succinct and correct explanation as to the why and how of each one. I think it’s useful to think about when you might want to use one technology over another and the tradeoffs that you make when you decide to, say, move to a Hadoop cluster over a single powerful machine. Be able to discuss a good use case for Spark or Kafka, for example. This is somewhat esoteric, but unfortunately there’s not as neat a template for these kinds of questions as there is for the algorithmic or SQL kind.

**Soft Skills**

Don’t neglect the soft skills portion of the interview, either! Good communication and problem solving skills go a long way.

1. One of the most important things you can do to prepare is to talk your way through the problems you are solving. It is really easy to get focused on a coding or schema design problem and go silent as you think; but unfortunately, that makes you completely inscrutable to the interviewer. Talking your way through the thought process is harder than it sounds, and it doesn’t come naturally; I really recommend explicitly practicing this as you work your way through algorithmic and design problems.
2. Write your code on a whiteboard rather than in an IDE or on paper. It sounds odd, but you will likely be asked to solve a problem on a whiteboard during your on-site interview, or even type into a blank word processor during a video call. If you’ve only practiced in IDEs that provide syntax support and familiar formatting, this will seem unnatural and can throw you off. Definitely explicitly practice it so it feels comfortable when it comes time for the interview.
3. Use the platform Pramp to work through real practice interviews with real people. This tool helped me a lot; like I mentioned in point 1, I found it very difficult to talk my way through problems, and when I hit an obstacle I would often freeze and go silent or into an excruciating “uh” mode where no prompting from the interviewer could help. Pramp is ostensibly low-pressure, because you are not actually interviewing; but it feels just as high-pressure, because you are working through problems in front of a stranger. It also puts you in the position of the interviewer, too, which I found really useful for expanding my understanding of problems.

## Data Engineer Interview Questions and How to Answer Them

Interviewing for any job can be stressful. In the technology industry, data engineer jobs can be incredibly competitive. Many people are attracted to these careers because they are in demand, offer high salaries, and have positive long-term job growth.

As you prepare for a future interview, be proud of how far you’ve come on your data engineering journey. Due to the sheer competition, some job searchers report applying for hundreds of jobs in big data until they actually get called for an interview, despite having the qualifications and skills needed, so don’t get discouraged if securing one takes longer than you expected. Once you do, you’ll need to clearly explain why and how you employed certain data methods and algorithms in a previous project in order to land the job.

If you are currently a data scientist or analyst, software engineer, or business intelligence analyst, you may be interviewing for a data engineer role. The average salary (in the US) for a data engineer is $113,597, with some earning as much as $164,000 a year, according to Glassdoor. Dice Insights reported in 2019 that data engineering is a top trending job in tech. 

Read more: [What Does a Data Engineer Do and How Do I Become One?](https://www.coursera.org/articles/what-does-a-data-engineer-do-and-how-do-i-become-one)

Interviews for big data roles tend to be focused on technical, rather than behavioral, questions. Here are general, process, and technical questions you might be asked during your data engineer interview.

Interviewers want to know about you and why you’re interested in becoming a data engineer. Data engineering is a technical role, so while you’re less likely to be asked behavioral questions, these higher-level questions might show up early in your interview.

### Tell me about yourself
   
**What they’re really asking:** What makes you a good fit for this job? 

This question is asked so often in interviews that it can seem generic and open-ended, but it’s really about your relationship with data engineering. Keep your answer focused on your path to becoming a data engineer. What attracted you to this career or industry? How did you develop your technical skills? 

**The interviewer might also ask:**

- Why did you choose to pursue a career in data engineering?
- Describe your path to becoming a data engineer.

### What is a data engineer’s role within a team or company?

**What they’re really asking:** What is a data engineer responsible for?

For this question, recruiters want to know that you’re aware of the duties of a data engineer. What do they do? What role do they play within a team? You should be able to describe the typical responsibilities, as well as who a data engineer works with on a team. If you have experience as a data scientist or analyst, you may want to describe how you’ve worked with data engineers in the past. 

**The interviewer might also ask:**

- What do data engineers do?
- How do data engineers work within a team?
- What impact does a data engineer have?

### When did you face a challenge in dealing with unstructured data and how did you solve it?

**What they’re really asking:** How do you deal with problems? What are your strengths and weaknesses?

Essentially, a data engineer’s main responsibility is to build the systems that collect, manage, and convert raw data into usable information for data scientists and business analysts to interpret. This question aims to ask about any obstacles you may have faced when dealing with a problem, and how you solved it.

This is your time to shine, where you can describe how you make data more accessible through coding and algorithms. Rather than explaining the technicalities at this point, remember the specific responsibilities listed in the job description and see if you can incorporate them into your answer.

**The interviewer might also ask:**

- How do you solve a business problem?
- What is your process for dealing with and solving problems during a project?
- Can you describe a time when you encountered a problem and solved it in an innovative manner?

Most often, data engineer job candidates will be asked about their projects. If you’ve never been a data engineer previously, you can describe projects that you either worked on for a class or one you posted on GitHub, a code hosting platform that promotes collaboration among developers.

### Walk me through a project you worked on from start to finish

**What they’re really asking:** How do you think through the process of acquiring, cleaning, and presenting data?

You’ll definitely be asked a question about your thought process and methodology for completing a project. Hiring managers want to know how you transformed the unstructured data into a complete product. You’ll want to practice explaining your logic for choosing certain algorithms in an easy-to-understand manner, to demonstrate you really know what you’re talking about. Afterward, you’ll be asked follow-up questions based on this project.

**The interviewer might also ask:**

- What was the most challenging project you’ve worked on, and how did you complete it?
- What is your process when you start a new project?

### What algorithm(s) did you use on the project?

**What they’re really asking:** Why did you choose this algorithm, and can you compare it with other similar algorithms? 

They want to know how you think through choosing one algorithm over another. It might be easiest to focus on a project that you worked on and link any follow-up questions to that project. If you have an example of a project and algorithm that relates to the company’s work, then choose that one to impress the interviewer. List the models you worked with, and then explain the analysis, results, and impact.

**The interviewer might also ask:**

- What is the scalability of this algorithm?
- If you were to do the project again, what would you do differently?

### What tools did you use on the project?

**What they’re really asking:** How did you arrive at your decision to use certain tools?

Data engineers must manage huge swaths of data, so they need to use the right tools and technologies to gather and prepare it all. If you have experience using different tools such as Hadoop, MongoDB, and Kafka, you’ll want to explain which one you used for that particular project.

You can go into detail about the ETL (extract, transform, and load) systems you used to move data from databases into a data warehouse, such as Stitch, Alooma, Xplenty, and Talend. Some tools work better for back-end, so if you can communicate strong decision-making abilities, then you’ll shine as a candidate who’s confident in their skills.

**The interviewer might also ask:**

- What are your favorite tools to use, and why?
- Compare and contrast two or three tools that you used on a recent project. 

Some interviewers might follow up with more technical questions, for which you may want to refresh your memory prior to the interview. Familiarize yourself with the concepts listed in the job description and practice talking through them.

### What is data modeling?

Data modeling is the initial step toward designing the database and analyzing data. You’ll want to explain that you’re capable of showing the relationship between structures, first with the conceptual model, then the logical model, and followed by the physical model.

### Explain the difference between structured data and unstructured data

Data engineers must turn unstructured data into structured data for data analysis using different methods for transformation. First, you can explain the difference between the two.

Structured data is made up of well-defined data types with patterns (using algorithms and coding) that make them easily searchable, whereas unstructured data is a bundle of files in various formats, such as videos, photos, texts, audio, and more.

Unstructured data exists in unmanaged file structures, so engineers collect, manage, and store it in database management systems (DBMS) turning it into structured data that is searchable. Unstructured data might be inputted through manual entry or batch processing with coding, so ELT is the tool used to transform and integrate data into a cloud-based data warehouse. 

Second, you can share a situation in which you transformed data into a structured format, drawing from learning projects if you’re lacking professional experience.

### What are the design schemas of data modeling?

Design schemas are fundamental to data engineering, so try to be accurate while explaining the concepts in everyday language. There are two schemas: star schema and snowflake schema.

Star schema has a fact table that has several associated dimension tables, so it looks like a star and is the simplest type of data warehouse schema. Snowflake schema is an extension of a star schema and adds additional dimension tables that split the data up, flowing out like a snowflake’s spokes.

### What are big data’s four Vs?

The four Vs are volume, velocity, variety, and veracity. Chances are, the interviewer will ask you not just what they are, but why they matter. You might explain that big data is about compiling, storing, and exploiting huge amounts of data to be useful for businesses. The four Vs must create a fifth V, which is value. 

- Volume: Refers to the size of the data sets (terabytes or petabytes) that need to be processed—for example, all of the credit card transactions that occur in a day in Latin America. 
- Velocity: Refers to the speed at which the data is generated. Instagram posts have high velocity. 
- Variety: Refers to the many sources and files types of structured and unstructured data. 
- Veracity: Refers to the quality of the data being analyzed. Data engineers need to understand different tools, algorithms, and analytics in order to cultivate meaningful information.

### Tell me some of the important features of Hadoop

Hadoop is an open-source software framework for storing data and running applications that provides mass amounts of storage and processing power. Your interviewer is testing whether you understand its significance in data engineering, so you’ll want to explain that it is compatible with multiple types of hardware that make it easy to access.

Hadoop supports rapid processing of data, storing it in the cluster which is independent of the rest of its operations. It allows you to create three replicas for each block with different nodes (collections of computers networked together to compute multiple data sets at the same time). 

### Which ETL tools have you worked with? What is your favorite, and why?

The interviewer is assessing your understanding of and experience with ETL tools. You’ll want to list the tools that you’ve mastered, explain your process for choosing certain tools for a particular project, and choose one. Explain the properties that you like about the tool to validate your decision.

### What is the difference between a data warehouse and an operational database?

For this question, you can answer by explaining that databases using Delete SQL statements, Insert, and Update focus on speed and efficiency, so analyzing data can be more challenging. With data warehouses, the primary focus is on calculations, aggregations, and select statements that make it ideal for data analysis.

## DE Interview Prep

Useful videos:
- https://www.youtube.com/watch?v=LQFsEwcCO1E
- https://www.youtube.com/watch?v=pV7XIZnsbgM
- https://www.youtube.com/watch?v=EVavVNhG5l8

Python:

Basics:
    https://www.youtube.com/watch?v=BCZWQTY9xPE&t=313s

I’m a big fan of NeetCode:
- https://www.youtube.com/watch?v=44H3cEC2fFM
- https://www.youtube.com/watch?v=xwf0kBjo79Q
- https://www.youtube.com/watch?v=ZHjKhUjcsaU
- https://www.youtube.com/watch?v=Pcd1ii9P9ZI

LC:
1, 3, 8, 13, 14, 26, 49, 56, 67, 76, 78, 125, 215, 346, 767, 884, 896

SQL:

Mock Interviews:
- Just watch part 2 the SQL portion: https://www.youtube.com/watch?v=XOJk0AKIqv8
- SQL & Product Sense: https://www.youtube.com/watch?v=_sSjBp9WES4
- This one is also really good: https://www.youtube.com/watch?v=4MWOXXLxSb4

Rolling sums:
- https://www.youtube.com/watch?v=G3kYPzLWtpo
- Previous values using window functions:
- https://www.youtube.com/watch?v=CDGwVXknZXI


Data Modeling:
- https://www.youtube.com/watch?v=_sSjBp9WES4

Read the first 3 chapters if short on time:
- https://github.com/ms2ag16/Books/blob/master/Kimball_The-Data-Warehouse-Toolkit-3rd-Edition.pdf
- https://www.youtube.com/watch?v=NPSQN9cRL3s
- https://www.youtube.com/watch?v=Tff34jj_V-0

Product Sense:
Videos above and
- https://www.youtube.com/watch?v=nPJKFWMiIC8
- https://www.youtube.com/watch?v=H8mogX0OwIQ

Dashboard Design (Just the basics):
- https://www.youtube.com/watch?v=xYjmSVd6CyY

Books:
- Cracking the Coding Interview
- Elements of Programming Interviews in Python: The Insiders' Guide
- Decode and Conquer: Answers to Product Management Interviews
- The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling (PDF link above)

