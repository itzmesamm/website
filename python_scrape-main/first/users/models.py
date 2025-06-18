from mongoengine import ListField, ReferenceField
from products.mongo_models import Product  # Make sure your product model is imported
from mongoengine import Document, StringField, EmailField
from datetime import datetime

class User(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    wishlist = ListField(StringField())  # store product IDs as strings
    date_joined = StringField(default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M:%S'))  # NEW

    meta = {
        'collection': 'users',
        'db_alias': 'default'
    }

    @property
    def is_authenticated(self):
        return True
