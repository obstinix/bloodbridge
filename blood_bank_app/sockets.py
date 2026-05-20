import logging
from flask_socketio import emit
from blood_bank_app.extensions import socketio, db
from blood_bank_app.models import BloodInventory

# Set up logging for sockets
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@socketio.on('connect')
def handle_connect():
    logger.info("Client connected to Socket.IO live inventory channel.")
    # Broadcast current inventory immediately to the newly connected client
    try:
        inventory = BloodInventory.query.order_by(BloodInventory.Blood_Group).all()
        emit('inventory_update', {'success': True, 'data': [i.to_dict() for i in inventory]})
    except Exception as e:
        logger.error(f"Socket IO connect emission error: {e}")

@socketio.on('disconnect')
def handle_disconnect():
    logger.info("Client disconnected from Socket.IO channel.")

def broadcast_inventory_update():
    """Queries current blood inventory and broadcasts it to all connected clients."""
    try:
        # Use application context if db is queried
        inventory = BloodInventory.query.order_by(BloodInventory.Blood_Group).all()
        data = [i.to_dict() for i in inventory]
        logger.info("Broadcasting live blood inventory updates to all clients.")
        socketio.emit('inventory_update', {'success': True, 'data': data})
    except Exception as e:
        logger.error(f"Failed to broadcast inventory update: {e}")
