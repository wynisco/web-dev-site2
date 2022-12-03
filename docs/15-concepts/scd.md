# Slowly Changing Dimensions

Over time, the attributes of a given row in a dimension table may change. For example, the shipping address for a customer may change. This phenomenon is called a slowly changing dimension (SCD). For historical reporting purposes, it may be necessary to keep a record of the fact that the customer has a change in address. The range of options for dealing with this involves SCD management methodologies referred to as type 1 to type 7. Type 0 is when no changes are allowed to the dimension, for example a date dimension that doesn’t change. The most common types are 1, 2 and 3:

- Type 1 (No history) – The dimension table reflects the latest version; no history is maintained
- Type 2 (Maintain history) – All changes are recorded and versions are tracked with dates and flags
- Type 3 (Previous value) – The [latest – 1] value for specific columns in maintained as a separate attribute