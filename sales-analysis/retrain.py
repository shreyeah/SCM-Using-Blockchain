# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
"""This will run once to train the model the first time."""

"""To retrain the model every time run the following function."""
def retrain_model(array_input):
    day=current_day()
    import numpy as np
    import pandas as pd 
    import pickle
    df = pd.read_csv("C:/Users/Akshi/reacmchain/sales-analysis/inventory.csv")
    df = pd.DataFrame(df)
    df = df[['ProductID','PriceReg','DayoftheYear','ItemCount']]
    #array_input =  [[1,23,300,100],[2,34,200,122],[3,32,400,300],[4,67,233,100],[5,98,211,400]]
    df2 = pd.DataFrame(array_input)
    df2.columns=['ProductID','PriceReg','DayoftheYear','ItemCount']
    df=df.append(df2)
    from sklearn import linear_model
    regr = linear_model.LinearRegression()
    train_x = np.asanyarray(df[['ProductID','PriceReg','DayoftheYear']])
    train_y = np.asanyarray(df[['ItemCount']])
    regr.fit(train_x, train_y)
    filename = 'finalized_model.sav'
    pickle.dump(regr, open(filename, 'wb'))
    df.to_csv("C:/Users/Akshi/reacmchain/sales-analysis/inventory.csv")


