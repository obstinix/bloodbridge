from flask import Blueprint, jsonify, request
from blood_bank_app.extensions import db
from blood_bank_app.models import Donor, Hospital, Donation, Request as BloodRequest, BloodInventory
from blood_bank_app.blueprints.api import jwt_required
from sqlalchemy import func
from datetime import date, timedelta
from blood_bank_app.ml.forecasting import get_demand_forecast

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/v1/analytics')

@analytics_bp.route('/summary', methods=['GET'])
@jwt_required
def get_summary():
    try:
        donor_count = Donor.query.filter_by(Is_Active=True).count()
        hospital_count = Hospital.query.filter_by(Is_Active=True).count()
        total_donations = db.session.query(func.sum(Donation.Quantity)).scalar() or 0
        total_requests = db.session.query(func.sum(BloodRequest.Quantity)).scalar() or 0
        
        return jsonify({
            'success': True,
            'data': {
                'donors': donor_count,
                'hospitals': hospital_count,
                'total_donations_ml': float(total_donations),
                'total_requests_ml': float(total_requests)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@analytics_bp.route('/trends', methods=['GET'])
@jwt_required
def get_trends():
    try:
        end_date = date.today()
        start_date = end_date - timedelta(days=30)
        
        donations = db.session.query(
            Donation.Date, func.sum(Donation.Quantity).label('total')
        ).filter(Donation.Date >= start_date).group_by(Donation.Date).all()
        
        requests = db.session.query(
            BloodRequest.Date, func.sum(BloodRequest.Quantity).label('total')
        ).filter(BloodRequest.Date >= start_date).group_by(BloodRequest.Date).all()
        
        d_map = {d.Date.strftime('%Y-%m-%d'): float(d.total) for d in donations}
        r_map = {r.Date.strftime('%Y-%m-%d'): float(r.total) for r in requests}
        
        trends = []
        for i in range(31): # Include today
            d = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
            trends.append({
                'date': d,
                'donations': d_map.get(d, 0.0),
                'requests': r_map.get(d, 0.0)
            })
            
        return jsonify({'success': True, 'data': trends})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@analytics_bp.route('/forecast', methods=['GET'])
@jwt_required
def get_forecast():
    try:
        blood_group = request.args.get('blood_group')
        days = int(request.args.get('days', 30))
        
        forecast_data = get_demand_forecast(blood_group=blood_group, days_ahead=days)
        return jsonify({
            'success': True,
            'data': forecast_data
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
