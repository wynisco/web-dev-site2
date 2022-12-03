# Other Questions

### How Would You Approach Developing a New Analytical Product as a Data Engineer?

As a data engineer, you control what is possible in the final product. A data scientist can’t build algorithms or metrics without having the right data and the data at the right granularity.

This means a data engineer needs to understand the entire product. A data engineer can’t just get away with building systems based off of requirements. They need to ask why they are building certain tables and objects.

It’s helpful if the stakeholders already have a general outline of what they want. If they don’t have an outline, we would want to work with them to develop a general idea of what metrics and algorithms will exist. This drives all the major decisions, including what data should be pulled, how long should it be stored, if should it be archived, and etc.

Once a general outline exists, the next step would be drilling into the why of each metric. This is because as you’re building different tables at different data granularities, certain issues might arise. Should the unique key be on columns A and B, or A, B, and C. Well, that depends, why is this important? What does that row signify? Is it customer level, store level, or maybe brand level?

Once your team has gone through the process of working on the outline with your stakeholders and gained an understanding of the why, the next step is to think through as many operational scenarios as possible.

Will you ever need to reload data? Do your ETLs allow for it? Is it efficient? What happens when X occurs? How do you handle case Y?

You can’t spend all day doing this, but trying to think of all the issues that could occur will help you develop a more robust system. It also helps create a system that actually meets requirements.

From there, it’s about developing the design, creating test cases, and testing the tables, stored procedures, and scripts, and then pushing to production. How that occurs usually changes from team to team.

### What Is the Difference Between an Operational Database and a Data Warehouse?

If you took a database course in college, then you probably learned about how to set up a standard normalized database. This style of database is optimized for transactions that involve Insert, Update, and Delete SQL statements. These are standard operational databases. They need to focus on making transactions quickly without getting bogged down by calculations and data manipulations. Thus, their design is a little more cumbersome for an analysis. Generally, you will have to join several tables just to get a single data point.

A data warehouse is not concerned as much with dealing with millions of fast transactions every second. Instead, a data warehouse is usually built to support a data analytics product and analysis. This means performance is not geared towards transactions — instead, it’s aimed at aggregations, calculations, and select statements. A data warehouse will have a slightly denormalized structure compared to an operational database. In most data warehouses, a majority of tables will take on two different attributes: a historical transaction table and tables that contain categorical style data. We reference these as fact and dimension tables.

The fact table is essentially in the center, unlike in a normalized database where you might have to join across several tables to get one data point. A standard data warehouse usually has a focus on the fact tables, and all the dimension tables join to provide categorical information to the fact table. It’s also typically bad practice to join fact table to the fact table, but sometimes it can occur if the data is created correctly.

These are not the only tables that exist in a data warehouse. There are aggregate tables, snapshots, partitions, and more. The goal is usually a report or dashboard that can be automatically updated quickly.

### Tell Us About a Time You Had Performance Issues With an ETL and How Did You Fix It?

As a data engineer, you will run into performance issues. Either you developed an ETL when the data was smaller and it didn’t scale, or you’re maintaining older architecture that is not scaling. ETLs feature multiple components, multiple table inserts, merges, and updates. This makes it difficult to tell exactly where the ETL issue is occurring. The first step is identifying the problem, so you need to figure out where the bottleneck is occurring.

Hopefully, whoever set up your ETL has an ETL log table somewhere that tracks when components finish. This makes it easy to spot bottlenecks and the biggest time sucks. If not, it will not be easy to find the issue. Depending on the urgency of the issue, we would recommend setting up an ETL log table and then rerunning to identify the issue. If the fix is needed right away, then you will probably just have to go piece-by-piece through the ETL to try to track down the long-running component. This also depends on how long the ETL takes to run. There are ways you can approach that as well depending on what the component relies on.

Issues can vary wildly, and they can include table locks, slow transactions, loops getting stuck, and etc. Once you have identified the issue, then you need to figure out a fix. This depends on the problem, but the solutions could require adding an index, removing an index, partitioning tables, and batching the data in smaller pieces (or sometimes even larger pieces — it seems counterintuitive, but this would depend on table scans and indexes). Depending on the storage system you are using, it’s good to look into the activity monitor to see what is happening on an I/O level. This will give you a better idea of the problem.

When you look at the activity monitor, you can see if there is any data being processed at all. Is there too much data being processed, none, or table locks? Any of these issues can choke an ETL and would need to be addressed.

If you Google some of the performance issues, then you will find some people blaming the architecture for a lot of the problems. We don’t disagree with them. However, this doesn’t mean you should throw in the towel. There are always various ways to manage performance if you can’t touch the actual structure. Even beyond indexes, there are some parallel processing methods that can be used to speed up the ETL. You can also add temporary support tables to lighten the load.

### Are You Experienced in Python, PowerShell, Bash, and or Java?

This question is more to note that it is important to have a scripting language on your side as a data engineer. Typically, most shops we have worked in won’t just rely on ETL tools like SSIS. Instead, they will often use custom scripts and libraries to load data. It might seem like overkill, but it is often easier. Using tools like SSIS are great if you need all the fancy functions, like sending emails and some of the other add-ons. Even these could be scripted instead of written.

So we do recommend having some scripting abilities as well. It allows you to easily automate data flow and analytical tasks.

