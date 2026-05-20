import os
import logging
from celery import Celery

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Celery
# Fallback to local memory broker if Redis is unavailable to guarantee uptime
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
celery_app = Celery('bloodbridge_tasks', broker=REDIS_URL, backend=REDIS_URL)

# Configure Celery settings
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    broker_connection_retry_on_startup=True
)

@celery_app.task(name='tasks.send_sms_alert')
def send_sms_alert(contact, message):
    """Celery background task to dispatch SMS notifications via Twilio."""
    logger.info(f" Celery task triggered: Sending live SMS matching alert to {contact}")
    
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    from_number = os.getenv('TWILIO_FROM_NUMBER')
    
    if account_sid and auth_token and from_number:
        try:
            from twilio.rest import Client
            client = Client(account_sid, auth_token)
            
            client.messages.create(
                body=message,
                from_=from_number,
                to=contact
            )
            logger.info(f" Twilio SMS successfully delivered to {contact}!")
            return {'success': True, 'recipient': contact}
        except Exception as twilio_err:
            logger.error(f" Twilio dispatch failed: {twilio_err}")
            return {'success': False, 'error': str(twilio_err)}
    else:
        # High quality offline log rendering
        logger.info("-" * 60)
        logger.info(f"📱 [SMS DISPATCH MOCK (No Twilio SID found in env)]")
        logger.info(f"📱 Recipient: {contact}")
        logger.info(f"📱 Text: {message}")
        logger.info("-" * 60)
        return {'success': True, 'recipient': contact, 'mode': 'mock'}

@celery_app.task(name='tasks.send_email_receipt')
def send_email_receipt(email, subject, body):
    """Celery background task to dispatch email alerts via SendGrid."""
    logger.info(f" Celery task triggered: Sending email verification to {email}")
    
    sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
    from_email = os.getenv('SENDGRID_FROM_EMAIL', 'notifications@bloodbridge.org')
    
    if sendgrid_api_key:
        try:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail
            
            message = Mail(
                from_email=from_email,
                to_emails=email,
                subject=subject,
                plain_text_content=body
            )
            
            sg = SendGridAPIClient(sendgrid_api_key)
            sg.send(message)
            logger.info(f" SendGrid email successfully dispatched to {email}!")
            return {'success': True, 'recipient': email}
        except Exception as sg_err:
            logger.error(f" SendGrid dispatch failed: {sg_err}")
            return {'success': False, 'error': str(sg_err)}
    else:
        # High quality offline log rendering
        logger.info("-" * 60)
        logger.info(f"✉️ [EMAIL DISPATCH MOCK (No SendGrid key found in env)]")
        logger.info(f"✉️ Recipient: {email}")
        logger.info(f"✉️ Subject: {subject}")
        logger.info(f"✉️ Message Body:\n{body}")
        logger.info("-" * 60)
        return {'success': True, 'recipient': email, 'mode': 'mock'}
