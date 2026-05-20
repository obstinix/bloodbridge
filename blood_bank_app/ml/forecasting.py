import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import date, timedelta
from blood_bank_app.models import Request
from blood_bank_app.extensions import db
from sqlalchemy import func

def get_demand_forecast(blood_group=None, days_ahead=30):
    """
    Train a simple LinearRegression model on the past 90 days of daily request volumes
    to forecast the next `days_ahead` days.
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=90)

    # Query daily requests volume
    query = db.session.query(
        Request.Date,
        func.sum(Request.Quantity).label('daily_total')
    ).filter(Request.Date >= start_date, Request.Date <= end_date)
    
    if blood_group:
        query = query.filter(Request.Blood_Group == blood_group)
        
    query = query.group_by(Request.Date).order_by(Request.Date).all()
    
    # If not enough data, return a generic or flat forecast
    if len(query) < 2:
        # Provide a dummy fallback if there's no data
        return {'forecast': [], 'confidence': 0.0}

    # Prepare data for sklearn
    X = []
    y = []
    for r in query:
        days_since = (r.Date - start_date).days
        X.append([days_since])
        y.append(float(r.daily_total))

    X = np.array(X)
    y = np.array(y)

    model = LinearRegression()
    model.fit(X, y)
    
    # Calculate confidence as R^2 score
    score = model.score(X, y)
    confidence = max(0.0, round(score * 100, 2))

    # Forecast
    forecast_data = []
    last_day_offset = (end_date - start_date).days
    
    for i in range(1, days_ahead + 1):
        future_day_offset = last_day_offset + i
        future_date = end_date + timedelta(days=i)
        
        pred = model.predict([[future_day_offset]])[0]
        # Demand shouldn't be negative
        pred = max(0.0, round(pred, 2))
        
        forecast_data.append({
            'date': future_date.strftime('%Y-%m-%d'),
            'predicted_demand': pred
        })

    return {
        'forecast': forecast_data,
        'confidence': confidence
    }
