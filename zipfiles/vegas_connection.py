import pandas as pd
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import os

user = "root"
password = os.getenv("MYSQL_PASSWORD")
host = "localhost"
port = 3306
database = "injuries"

password = quote_plus(password)

engine = create_engine(
    f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
)


df = pd.read_sql("SELECT * FROM INJURY_GENERAL", engine)
print(df.head())
print(df.shape)
print(df.columns)